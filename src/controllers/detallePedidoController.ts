import { Request, Response } from "express";
import pool from "../config/db";

// Obtener todos los detalles de Pedido
export const obtenerDetallesPedido = async (_req: Request, res: Response) => {
  try {
    const pedidos = await pool.query("SELECT * FROM DetallesPedido");
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener detalles pedidos", error: error.message });
  }
};

// Crear un nuevo detalle de pedido
export const registrarDetallePedido = async (req: Request, res: Response) => {
  try {
    const { id_detalle_pedido, id_pedido, id_producto, cantidad_pedida, fecha_estimada_entrega, precio_total } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!id_detalle_pedido || !id_pedido || !id_producto || !cantidad_pedida || !fecha_estimada_entrega || !precio_total) {
        res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        return;
      }
  
    const result = await pool.query(
      "INSERT INTO DetallesPedido (id_detalle_pedido, id_pedido, id_producto, cantidad_pedida, fecha_estimada_entrega, precio_total) VALUES (?, ?, ?, ?, ?, ?)",
      [id_detalle_pedido, id_pedido, id_producto, cantidad_pedida, fecha_estimada_entrega, precio_total]
    );

    // Convertir `insertId` a `Number`
    const insertId = Number((result as any).insertId);  

    res.status(201).json({ mensaje: "Detalle de pedido creado correctamente", id: insertId });
  } catch (error) {
    console.error("Error en registrarCliente:", error); 
    res.status(500).json({ mensaje: "Error al registrar detalle de pedido", error: error.message });
  }
};
