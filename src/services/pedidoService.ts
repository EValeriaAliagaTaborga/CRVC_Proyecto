import * as PedidoModel from "../models/Pedido";

export const obtenerPedidos = async () => {
  const pedidos: any = await PedidoModel.getAllPedidos();

  for (const pedido of pedidos) {
    pedido.detalles = await PedidoModel.getDetallesByPedido(pedido.id_pedido);
  }

  return pedidos;
};

export const registrarPedido = async (
  id_construccion: number,
  detalles: {
    id_producto: number,
    cantidad: number,
    fecha_entrega: string,
    precio_total: number
  }[],
  precio: number,
  descuento: number,
  estado: string
) => {
  const id_pedido = await PedidoModel.createPedido(id_construccion, precio, descuento, estado);

  for (const detalle of detalles) {
    await PedidoModel.createDetallePedido(
      id_pedido,
      detalle.id_producto,
      detalle.cantidad,
      detalle.fecha_entrega,
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
