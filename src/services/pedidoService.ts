import * as PedidoModel from "../models/Pedido";
import * as ProductoModel from "../models/Producto";
import * as DemandaService from "./demandaProduccionService";
import * as NotiService from "./notificacionService";

export const obtenerPedidos = async () => {
  const pedidos: any[] = await PedidoModel.getAllPedidos();
  const pedidosConDetalles = await Promise.all(
    pedidos.map(async (p) => {
      const dets = await PedidoModel.getDetallesByPedido(p.id_pedido);
      return { ...p, detalles: Array.isArray(dets) ? dets : [] };
    })
  );
  return pedidosConDetalles;
};

export const registrarPedido = async (
  id_construccion: number,
  detalles: {
    id_producto: string;
    cantidad_pedida: number;
    fecha_estimada_entrega: string;
    precio_total: number;
  }[],
  precio: number,
  descuento: number,
  tipo_descuento: string,
  estado: string
) => {
  if (!Array.isArray(detalles) || detalles.length === 0) {
    throw Object.assign(new Error("El pedido debe incluir al menos un detalle"), { code: "NO_DETAILS" });
  }

  // Cargar productos una sola vez
  const ids = Array.from(new Set(detalles.map(d => d.id_producto)));
  const productos = await Promise.all(ids.map(id => ProductoModel.getProductoById(id)));
  const byId: Record<string, any> = {};
  for (const p of productos) if (p) byId[p.id_producto] = p;

  // Sumar cantidades por producto (por si repiten líneas)
  const solicitadas: Record<string, number> = {};
  for (const d of detalles) {
    solicitadas[d.id_producto] = (solicitadas[d.id_producto] || 0) + Number(d.cantidad_pedida || 0);
  }

  // ====== Camino 1: pedido creado como "Entregado" ======
  if (estado === "Entregado") {
    // Validar stock para TODOS los productos (Primera/Segunda/Tercera)
    const faltantes: { id_producto: string; solicitado: number; stock: number }[] = [];
    for (const id of Object.keys(solicitadas)) {
      const prod = byId[id];
      if (!prod) continue;
      const solicitado = solicitadas[id];
      const stock = Number(prod.cantidad_stock || 0);
      if (solicitado > stock) {
        faltantes.push({ id_producto: id, solicitado, stock });
      }
    }
    if (faltantes.length > 0) {
      const err: any = new Error("No se puede crear el pedido entregado: faltan existencias.");
      err.code = "INSUFFICIENT_STOCK_AT_CREATION";
      err.details = faltantes;
      throw err;
    }

    // Transacción: crea pedido, marca todos los detalles entregados, descuenta stock y registra SALIDAS
    const conn = await PedidoModel.getConnection();
    try {
      await conn.beginTransaction();

      const id_pedido = await PedidoModel.createPedido(
        id_construccion, precio, descuento, tipo_descuento, "Entregado"
      );

      for (const d of detalles) {
        // 1) Detalle entregado
        await PedidoModel.createDetallePedido(
          id_pedido,
          d.id_producto,
          d.cantidad_pedida,
          d.fecha_estimada_entrega,
          d.precio_total,
          true // entregado
        );

        // 2) Descontar stock
        await ProductoModel.adjustStockTx(conn, d.id_producto, -Number(d.cantidad_pedida || 0));

        // 3) Kardex SALIDA
        await ProductoModel.insertMovimientoTx(conn, {
          id_producto: d.id_producto,
          tipo_movimiento: "SALIDA",
          cantidad: Number(d.cantidad_pedida || 0),
          motivo: "Entrega de pedido (alta como Entregado)",
          referencia: `Pedido ${id_pedido}`,
          id_usuario: null
        });
      }

      await conn.commit();
      await conn.release();
      return id_pedido;
    } catch (e) {
      await conn.rollback();
      await conn.release();
      throw e;
    }
  }

  // ====== Camino 2: pedido NO entregado (flujo normal) ======
  // Validación: Segunda/Tercera no deben exceder stock (Primera sí puede)
  const violaciones: { id_producto: string; tipo: string; solicitado: number; stock: number }[] = [];
  for (const id of Object.keys(solicitadas)) {
    const prod = byId[id];
    if (!prod) continue;
    const solicitado = solicitadas[id];
    const stock = Number(prod.cantidad_stock || 0);
    const tipo = String(prod.tipo || "");
    if ((tipo === "Segunda" || tipo === "Tercera") && solicitado > stock) {
      violaciones.push({ id_producto: id, tipo, solicitado, stock });
    }
  }
  if (violaciones.length > 0) {
    const err: any = new Error("No se puede crear el pedido: algunos productos de Segunda/Tercera exceden el stock disponible.");
    err.code = "ORDER_EXCEEDS_STOCK_FOR_LOWER_QUALITY";
    err.details = violaciones;
    throw err;
  }

  // Crear pedido
  const id_pedido = await PedidoModel.createPedido(
    id_construccion, precio, descuento, tipo_descuento, estado
  );

  // Crear detalles y generar demanda SOLO para Primera
  for (const d of detalles) {
    await PedidoModel.createDetallePedido(
      id_pedido,
      d.id_producto,
      d.cantidad_pedida,
      d.fecha_estimada_entrega,
      d.precio_total,
      false // entregado
    );

    const prod = byId[d.id_producto] || (await ProductoModel.getProductoById(d.id_producto));
    if (prod && String(prod.tipo) === "Primera") {
      await DemandaService.acumularDemanda({
        id_producto: d.id_producto,
        nombre_producto: prod.nombre_producto,
        tipo: prod.tipo,
        cantidad: Number(d.cantidad_pedida) || 0,
        fecha_objetivo: d.fecha_estimada_entrega?.split("T")[0] || null,
      });
    }
  }

  // Notificar Encargados si hubo Primera
  const huboPrimera = Object.keys(solicitadas).some(id => {
    const prod = byId[id];
    return prod && String(prod.tipo) === "Primera";
  });
  if (huboPrimera) {
    await NotiService.crearNotifRol(
      "3",
      "Nueva demanda de producción",
      `Se registraron pedidos que requieren producción. Revisa Demandas pendientes. Pedido #${id_pedido}`
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
  await PedidoModel.updateDetallePedido(id_detalle, entregado, fecha_estimada_entrega);
};

/**
 * Transaccional para marcar entrega (sin cambios ahora).
 */
export const actualizarEntregaDetalleTransaccional = async (
  pedidoId: number,
  detalleId: number,
  entregado: boolean,
  userId?: number,
  _userRol?: string
) => {
  const conn = await PedidoModel.getConnection();
  try {
    await conn.beginTransaction();

    const pedido = await PedidoModel.getPedidoByIdTx(conn, pedidoId);
    if (!pedido) throw Object.assign(new Error("Pedido no encontrado"), { code: "NOT_FOUND" });
    if (pedido.estado_pedido === "Cancelado") {
      throw Object.assign(new Error("El pedido está cancelado."), { code: "ORDER_CANCELED" });
    }

    const det = await PedidoModel.getDetalleByIdTx(conn, detalleId);
    if (!det || det.id_pedido !== pedidoId) {
      throw Object.assign(new Error("Detalle no encontrado o no pertenece al pedido."), { code: "NOT_FOUND" });
    }

    if (!!det.entregado === entregado) {
      await conn.commit();
      return { ok: true, pedidoActualizado: false, message: "Sin cambios" };
    }

    if (det.entregado === 1 && entregado === false) {
      throw Object.assign(new Error("No está permitido revertir una entrega ya confirmada."), { code: "REVERT_NOT_ALLOWED" });
    }

    if (entregado === true) {
      const prod = await ProductoModel.getProductoByIdTx(conn, det.id_producto);
      if (!prod) throw Object.assign(new Error("Producto no encontrado"), { code: "NOT_FOUND" });

      const cantidadNecesaria = Number(det.cantidad_pedida) || 0;
      const stockActual = Number(prod.cantidad_stock) || 0;

      if (stockActual < cantidadNecesaria) {
        throw Object.assign(
          new Error("No hay existencias suficientes para completar esta entrega. Contacte con el administrador."),
          { code: "INSUFFICIENT_STOCK" }
        );
      }

      await PedidoModel.updateDetalleEntregaTx(conn, detalleId, true);
      await ProductoModel.adjustStockTx(conn, det.id_producto, -cantidadNecesaria);
      await ProductoModel.insertMovimientoTx(conn, {
        id_producto: det.id_producto,
        tipo_movimiento: "SALIDA",
        cantidad: cantidadNecesaria,
        motivo: "Entrega de pedido",
        referencia: `Pedido ${pedidoId} - Detalle ${detalleId}`,
        id_usuario: userId ?? null,
      });
    }

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
