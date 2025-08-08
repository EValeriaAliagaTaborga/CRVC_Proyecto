import * as PedidoModel from '../src/models/Pedido';
import {
  obtenerPedidos,
  registrarPedido,
  cambiarEstadoPedido,
  eliminarPedido
} from '../src/services/pedidoService';

jest.mock('../src/models/Pedido');

describe('pedidoService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('obtenerPedidos devuelve pedidos con detalles', async () => {
    (PedidoModel.getAllPedidos as jest.Mock).mockResolvedValue([{ id_pedido: 1 }, { id_pedido: 2 }]);
    (PedidoModel.getDetallesByPedido as jest.Mock).mockResolvedValue([]);

    const res = await obtenerPedidos();

    expect(PedidoModel.getAllPedidos).toHaveBeenCalled();
    expect(PedidoModel.getDetallesByPedido).toHaveBeenCalledTimes(2);
    expect(PedidoModel.getDetallesByPedido).toHaveBeenNthCalledWith(1, 1);
    expect(PedidoModel.getDetallesByPedido).toHaveBeenNthCalledWith(2, 2);
    expect(res).toEqual([{ id_pedido: 1, detalles: [] }, { id_pedido: 2, detalles: [] }]);
  });

  it('registrarPedido crea pedido y detalles', async () => {
    (PedidoModel.createPedido as jest.Mock).mockResolvedValue(5);
    const detalles = [{ id_producto: 1, cantidad_pedida: 2, fecha_estimada_entrega: 'f', precio_total: 10 }];
    const id = await registrarPedido(3, detalles, 50, 5, 'Nuevo');

    expect(PedidoModel.createPedido).toHaveBeenCalledWith(3, 50, 5, 'Nuevo');
    expect(PedidoModel.createDetallePedido).toHaveBeenCalledWith(5, 1, 2, 'f', 10);
    expect(id).toBe(5);
  });

  it('cambiarEstadoPedido actualiza el estado', async () => {
    await cambiarEstadoPedido(2, 'Entregado');
    expect(PedidoModel.updateEstadoPedido).toHaveBeenCalledWith(2, 'Entregado');
  });

  it('eliminarPedido elimina el pedido', async () => {
    await eliminarPedido(4);
    expect(PedidoModel.deletePedido).toHaveBeenCalledWith(4);
  });
});
