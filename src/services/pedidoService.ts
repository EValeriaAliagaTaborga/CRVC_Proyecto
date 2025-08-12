import * as PedidoModel from "../models/Pedido";
import pool from "../config/db";

export const obtenerPedidos = async () => {
  const pedidos: any[] = await PedidoModel.getAllPedidos();

  const pedidosConDetalles = await Promise.all(
    pedidos.map(async (p) => {
      const dets = await PedidoModel.getDetallesByPedido(p.id_pedido);
      return {
        ...p,
        detalles: Array.isArray(dets) ? dets : []
      };
    })
  );

  return pedidosConDetalles;
};

export const registrarPedido = async (
  id_construccion: number,
  detalles: {
    id_producto: string,
    cantidad_pedida: number,
    fecha_estimada_entrega: string,
    precio_total: number
  }[],
  precio: number,
  descuento: number,
  tipo_descuento: string,
  estado: string
) => {
  const id_pedido = await PedidoModel.createPedido(
    id_construccion,
    precio,
    descuento,
    tipo_descuento,
    estado
  );

  for (const detalle of detalles) {
    await PedidoModel.createDetallePedido(
      id_pedido,
      detalle.id_producto,
      detalle.cantidad_pedida,
      detalle.fecha_estimada_entrega,
      detalle.precio_total
    );
  }

  return id_pedido;
};

export const cambiarEstadoPedido = async (id: number, estado: string) => {
  await PedidoModel.updateEstadoPedido(id, estado);
};

export const eliminarPedido = async (id: number) => {
  await PedidoModel.deletePedido(id);
};

export const cambiarEntregaDetalle = async (id_detalle: number, entregado: boolean) => {
  await PedidoModel.updateDetalleEntrega(id_detalle, entregado);
};

export const actualizarDetalle = async (
  id_detalle: number,
  entregado: boolean,
  fecha_estimada_entrega: string
) => {
  // Nota: aquí NO ejecutamos lógica de stock; sólo actualizamos fecha/flag simple.
  // La lógica de stock va en actualizarEntregaDetalleTransaccional.
  await PedidoModel.updateDetallePedido(
    id_detalle,
    entregado,
    fecha_estimada_entrega
  );
};

/**
 * Reglas extra activadas:
 * 1) Bloquear entrega si pedido está Cancelado (ORDER_CANCELED -> 400).
 * 2) Permitir revertir entrega (true->false) SOLO si:
 *    - Usuario es admin (rol "1"), y
 *    - Han pasado ≤ 24 horas desde la entrega (fecha_entrega_real).
 *    Si no, REVERT_NOT_ALLOWED -> 400.
 * 3) Kardex (MovimientosInventario): registrar SALIDA en entrega y ENTRADA en reversión.
 *
 * Requiere columnas/tabla:
 * - DetalleDePedidos.fecha_entrega_real DATETIME NULL
 * - Tabla MovimientosInventario (ver SQL de migración al final).
 */
export async function actualizarEntregaDetalleTransaccional(
  pedidoId: number,
  detalleId: number,
  entregado: boolean,
  userId?: number,
  userRol?: string
) {
  const conn = await (pool as any).getConnection();
  try {
    await conn.beginTransaction();

    // 0) Estado del pedido (bloqueo por cancelado)
    const [pedidoRows] = await conn.query(
      `SELECT estado_pedido FROM Pedidos WHERE id_pedido = ? FOR UPDATE`,
      [pedidoId]
    );
    if (!(pedidoRows as any[]).length) throw new Error("Pedido no encontrado");
    const estadoPedido = (pedidoRows as any)[0].estado_pedido as string;
    if (estadoPedido === "Cancelado") {
      const err: any = new Error("El pedido está cancelado. No se permiten entregas.");
      err.code = "ORDER_CANCELED";
      throw err;
    }

    // 1) Trae detalle + producto + estado actual (FOR UPDATE)
    const [rows] = await conn.query(
      `SELECT d.id_detalle_pedido, d.id_producto, d.cantidad_pedida, d.entregado, d.fecha_entrega_real,
              p.id_pedido, pr.cantidad_stock, pr.nombre_producto, pr.tipo
       FROM DetalleDePedidos d
       JOIN Pedidos p ON p.id_pedido = d.id_pedido
       JOIN Productos pr ON pr.id_producto = d.id_producto
       WHERE d.id_detalle_pedido = ? AND p.id_pedido = ? FOR UPDATE`,
      [detalleId, pedidoId]
    );
    if (!(rows as any[]).length) throw new Error("Detalle no encontrado");
    const det = (rows as any)[0] as {
      id_detalle_pedido: number;
      id_producto: string;
      cantidad_pedida: number;
      entregado: number; // 0/1
      fecha_entrega_real: Date | null;
      id_pedido: number;
      cantidad_stock: number;
      nombre_producto: string;
      tipo: string;
    };

    const wasDelivered = !!det.entregado;

    // 2) Reglas de reversión (true -> false): solo admin y ≤ 24 h
    if (!entregado && wasDelivered) {
      const isAdmin = userRol === "1";
      const ts = det.fecha_entrega_real ? new Date(det.fecha_entrega_real).getTime() : 0;
      const now = Date.now();
      const hours = ts ? (now - ts) / 36e5 : Infinity;

      if (!isAdmin || hours > 24) {
        const err: any = new Error("No se permite revertir la entrega (solo admin y dentro de 24 horas).");
        err.code = "REVERT_NOT_ALLOWED";
        throw err;
      }

      // Reposición de stock
      await conn.query(
        `UPDATE Productos
         SET cantidad_stock = cantidad_stock + ?
         WHERE id_producto = ?`,
        [det.cantidad_pedida, det.id_producto]
      );

      // Kardex ENTRADA (reversión)
      await conn.query(
        `INSERT INTO MovimientosInventario
          (id_producto, tipo_movimiento, cantidad, motivo, referencia, id_usuario)
         VALUES (?, 'ENTRADA', ?, 'Reversión de entrega', ?, ?)`,
        [det.id_producto, det.cantidad_pedida, `PED-${pedidoId}/DET-${detalleId}`, userId || null]
      );
    }

    // 3) Si se marca entregado y antes no lo estaba → validar stock, descontar, setear fecha_entrega_real
    if (entregado && !wasDelivered) {
      if (det.cantidad_stock < det.cantidad_pedida) {
        const err: any = new Error(
          `Stock insuficiente para ${det.nombre_producto} (${det.tipo}). ` +
          `Stock: ${det.cantidad_stock}, requerido: ${det.cantidad_pedida}.`
        );
        err.code = "INSUFFICIENT_STOCK";
        throw err;
      }
      // Descontar stock
      await conn.query(
        `UPDATE Productos
         SET cantidad_stock = cantidad_stock - ?
         WHERE id_producto = ?`,
        [det.cantidad_pedida, det.id_producto]
      );

      // Kardex SALIDA
      await conn.query(
        `INSERT INTO MovimientosInventario
          (id_producto, tipo_movimiento, cantidad, motivo, referencia, id_usuario)
         VALUES (?, 'SALIDA', ?, 'Entrega de pedido', ?, ?)`,
        [det.id_producto, det.cantidad_pedida, `PED-${pedidoId}/DET-${detalleId}`, userId || null]
      );
    }

    // 4) Actualiza flag del detalle y fecha_entrega_real
    if (entregado !== wasDelivered) {
      await conn.query(
        `UPDATE DetalleDePedidos
         SET entregado = ?, fecha_entrega_real = (CASE WHEN ?=1 THEN NOW() ELSE NULL END)
         WHERE id_detalle_pedido = ?`,
        [entregado ? 1 : 0, entregado ? 1 : 0, detalleId]
      );
    }

    // 5) ¿El pedido quedó completamente entregado?
    const [rowsPend] = await conn.query(
      `SELECT COUNT(*) AS pendientes
       FROM DetalleDePedidos
       WHERE id_pedido = ? AND entregado = 0`,
      [pedidoId]
    );
    const pendientes = (rowsPend as any)[0]?.pendientes ?? 0;
    let pedidoCompletado = false;
    if (pendientes === 0) {
      pedidoCompletado = true;
      await conn.query(
        `UPDATE Pedidos
         SET estado_pedido = 'Entregado', fecha_entrega = NOW()
         WHERE id_pedido = ?`,
        [pedidoId]
      );
    }

    await conn.commit();
    return {
      ok: true,
      pedidoId,
      detalleId,
      applied: entregado !== wasDelivered,
      pedidoCompletado,
      nuevoEstadoPedido: pedidoCompletado ? "Entregado" : undefined,
    };
  } catch (e: any) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}
