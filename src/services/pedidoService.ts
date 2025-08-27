import * as PedidoModel from "../models/Pedido";
import * as ProductoModel from "../models/Producto";
import * as DemandaService from "./demandaProduccionService";
import * as NotiService from "./notificacionService";

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
    id_construccion, precio, descuento, tipo_descuento, estado
  );

  for (const detalle of detalles) {
    await PedidoModel.createDetallePedido(
      id_pedido,
      detalle.id_producto,
      detalle.cantidad_pedida,
      detalle.fecha_estimada_entrega,
      detalle.precio_total
    );

    // ---- Acumular demanda de producción + notificar rol 3 ----
    const prod = await ProductoModel.getProductoById(detalle.id_producto);
    if (prod) {
      await DemandaService.acumularDemanda({
        id_producto: detalle.id_producto,
        nombre_producto: prod.nombre_producto,
        tipo: prod.tipo,
        cantidad: Number(detalle.cantidad_pedida) || 0,
        fecha_objetivo: detalle.fecha_estimada_entrega?.split("T")[0] || null
      });
    }
  }

  // Notificar a Encargados de Producción (rol "3")
  await NotiService.crearNotifRol(
    "3",
    "Nueva demanda de producción",
    `Se registraron pedidos que requieren producción. Revisa Demandas pendientes. Pedido #${id_pedido}`
  );

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
  await PedidoModel.updateDetallePedido(id_detalle, entregado, fecha_estimada_entrega);
};

/**
 * Transaccional: aplicar reglas de negocio al marcar entrega de un detalle.
 * Reglas:
 *  - Si el pedido está "Cancelado" => error ORDER_CANCELED
 *  - Si se marca entregado=true => validar stock suficiente; descontar stock; insertar movimiento SALIDA
 *  - Si se intenta revertir (entregado=false) cuando ya estaba entregado => error REVERT_NOT_ALLOWED
 *  - Si al finalizar todos los detalles del pedido están entregados => estado del pedido = "Entregado"
 * Devuelve: { ok: true, pedidoActualizado?: boolean }
 */
export const actualizarEntregaDetalleTransaccional = async (
  pedidoId: number,
  detalleId: number,
  entregado: boolean,
  userId?: number,
  _userRol?: string
) => {
  // Inicia transacción
  const conn = await PedidoModel.getConnection();
  try {
    await conn.beginTransaction();

    const pedido = await PedidoModel.getPedidoByIdTx(conn, pedidoId);
    if (!pedido) {
      throw Object.assign(new Error("Pedido no encontrado"), { code: "NOT_FOUND" });
    }
    if (pedido.estado_pedido === "Cancelado") {
      throw Object.assign(new Error("El pedido está cancelado."), { code: "ORDER_CANCELED" });
    }

    const det = await PedidoModel.getDetalleByIdTx(conn, detalleId);
    if (!det || det.id_pedido !== pedidoId) {
      throw Object.assign(new Error("Detalle no encontrado o no pertenece al pedido."), { code: "NOT_FOUND" });
    }

    // Idempotencia simple:
    if (!!det.entregado === entregado) {
      await conn.commit();
      return { ok: true, pedidoActualizado: false, message: "Sin cambios" };
    }

    // Si quieren revertir una entrega ya realizada: bloqueado
    if (det.entregado === 1 && entregado === false) {
      throw Object.assign(new Error("No está permitido revertir una entrega ya confirmada."), { code: "REVERT_NOT_ALLOWED" });
    }

    // Marcar como entregado => validar stock y descontar
    if (entregado === true) {
      const prod = await ProductoModel.getProductoByIdTx(conn, det.id_producto);
      if (!prod) {
        throw Object.assign(new Error("Producto no encontrado"), { code: "NOT_FOUND" });
      }
      const cantidadNecesaria = Number(det.cantidad_pedida) || 0;
      const stockActual = Number(prod.cantidad_stock) || 0;

      if (stockActual < cantidadNecesaria) {
        throw Object.assign(
          new Error("No hay existencias suficientes para completar la entrega. Contacte con el administrador."),
          { code: "INSUFFICIENT_STOCK" }
        );
      }

      // 1) Actualizar detalle
      await PedidoModel.updateDetalleEntregaTx(conn, detalleId, true);

      // 2) Descontar stock
      await ProductoModel.adjustStockTx(conn, det.id_producto, -cantidadNecesaria);

      // 3) Movimiento de Kardex (SALIDA)
      await ProductoModel.insertMovimientoTx(conn, {
        id_producto: det.id_producto,
        tipo_movimiento: "SALIDA",
        cantidad: cantidadNecesaria,
        motivo: "Entrega de pedido",
        referencia: `Pedido ${pedidoId} - Detalle ${detalleId}`,
        id_usuario: userId ?? null
      });
    }

    // ¿Todos entregados?
    const pendientes = await PedidoModel.countDetallesPendientesTx(conn, pedidoId);
    let pedidoActualizado = false;
    if (pendientes === 0) {
      await PedidoModel.updateEstadoPedidoTx(conn, pedidoId, "Entregado");
      pedidoActualizado = true;
    }

    await conn.commit();
    return { ok: true, pedidoActualizado };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.release();
  }
};
