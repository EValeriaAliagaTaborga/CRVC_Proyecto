import { Request, Response } from "express";
import * as PedidoService from "../services/pedidoService";
import { registrarLog } from "../utils/logHelper";

export const listarPedidos = async (_req: Request, res: Response) => {
  try {
    const pedidos = await PedidoService.obtenerPedidos();
    res.json(pedidos);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al obtener pedidos", error: error.message });
  }
};

export const crearPedido = async (req: Request, res: Response) => {
  try {
    const {
      id_construccion,
      detalles,
      precio_pedido,
      descuento_pedido,
      tipo_descuento,
      estado_pedido,
    } = req.body;

    const id = await PedidoService.registrarPedido(
      Number(id_construccion),
      detalles,
      Number(precio_pedido),
      Number(descuento_pedido),
      tipo_descuento,
      estado_pedido
    );
    res
      .status(201)
      .json({ message: "Pedido creado correctamente", id_pedido: id });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al crear pedido", error: error.message });
  }
};

export const actualizarEstadoPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado_pedido } = req.body;
    await PedidoService.cambiarEstadoPedido(Number(id), estado_pedido);

    const id_usuario_log = (req as any).usuario.id;
    await registrarLog(
      id_usuario_log,
      "Actualizacion de Pedido",
      `Pedido ID: ${id} - Estado: ${estado_pedido}`
    );

    res.json({ message: "Estado de pedido actualizado correctamente" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al actualizar estado", error: error.message });
  }
};

export const eliminarPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await PedidoService.eliminarPedido(Number(id));

    const id_usuario_log = (req as any).usuario.id;
    await registrarLog(
      id_usuario_log,
      "Actualizacion de Pedido",
      `Pedido ID: ${id}`
    );

    res.json({ message: "Pedido eliminado correctamente" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al eliminar pedido", error: error.message });
  }
};

export const actualizarEntregaDetalle = async (req: Request, res: Response) => {
  try {
    const pedidoId = Number(req.params.id);
    const detalleId = Number(req.params.detalleId);
    const { entregado } = req.body as { entregado: boolean };

    const user = (req as any).usuario || {};
    const userId = user.id;
    const userRol = user.rol; // "1" admin, "2" vendedor

    const result = await PedidoService.actualizarEntregaDetalleTransaccional(
      pedidoId,
      detalleId,
      entregado,
      userId,
      userRol
    );

    // Log
    try {
      await registrarLog(
        userId,
        "Entrega de Detalle",
        `Pedido ${pedidoId}, Detalle ${detalleId}, entregado=${entregado}`
      );
    } catch {}

    res.json(result);
  } catch (err: any) {
    if (err.code === "INSUFFICIENT_STOCK") {
      return res.status(409).json({ message: err.message });
    }
    if (err.code === "REVERT_NOT_ALLOWED") {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === "ORDER_CANCELED") {
      return res.status(400).json({ message: err.message });
    }
    res
      .status(500)
      .json({ message: "Error actualizando entrega", error: err.message });
  }
};

export const actualizarDetallePedido = async (req: Request, res: Response) => {
  try {
    const { detalleId } = req.params;
    const { entregado, fecha_estimada_entrega } = req.body;
    await PedidoService.actualizarDetalle(
      Number(detalleId),
      Boolean(entregado),
      fecha_estimada_entrega
    );
    res.json({ message: "Detalle de pedido actualizado" });
  } catch (err: any) {
    res.status(500).json({ message: "Error actualizando detalle", error: err.message });
  }
};
