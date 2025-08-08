import * as PedidoModel from "../models/Pedido";

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
  // Creamos el pedido incluyendo tipo_descuento
  const id_pedido = await PedidoModel.createPedido(
    id_construccion,
    precio,
    descuento,
    tipo_descuento,
    estado
  );

  // ¡Este bucle NUNCA debe saltarse!
  for (const detalle of detalles) {
    await PedidoModel.createDetallePedido(
      id_pedido,
      detalle.id_producto,           // string
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