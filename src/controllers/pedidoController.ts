import { Request, Response } from "express";
import * as PedidoService from "../services/pedidoService";

export const listarPedidos = async (_req: Request, res: Response) => {
  try {
    const pedidos = await PedidoService.obtenerPedidos();
    res.json(pedidos);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
  }
};

export const crearPedido = async (req: Request, res: Response) => {
  try {
    const { id_construccion, detalles, precio_pedido, descuento_pedido, estado_pedido } = req.body;

    const id = await PedidoService.registrarPedido(
      id_construccion,
      detalles,
      precio_pedido,
      descuento_pedido,
      estado_pedido
    );

    res.status(201).json({ message: "Pedido creado correctamente", id_pedido: id });
  } catch (error: any) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ message: "Error al registrar pedido", error: error.message });
  }
};

export const actualizarEstadoPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado_pedido } = req.body;
    await PedidoService.cambiarEstadoPedido(Number(id), estado_pedido);
    res.json({ message: "Estado de pedido actualizado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar estado", error: error.message });
  }
};

export const eliminarPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await PedidoService.eliminarPedido(Number(id));
    res.json({ message: "Pedido eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar pedido", error: error.message });
  }
};
