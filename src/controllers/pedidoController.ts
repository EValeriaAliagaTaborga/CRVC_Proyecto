import { Request, Response } from "express";
import pool from "../config/db";

// Obtener todos los pedido
export const obtenerPedido = async (_req: Request, res: Response) => {
  try {
    const pedidos = await pool.query("SELECT * FROM Pedidos");
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener pedidos", error: error.message });
  }
};

// Crear un nuevo pedido
export const registrarPedido = async (req: Request, res: Response) => {
  try {
    const { id_construccion, id_usuario, estado_pedido } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!id_construccion || !id_usuario || !estado_pedido ) {
        res.status(400).json({ mensaje: "id_construccion, id_usuario, estado_pedido son obligatorios" });
        return;
      }
  
    const result = await pool.query(
      "INSERT INTO Pedidos (id_construccion, id_usuario, estado_pedido) VALUES (?, ?, ?)",
      [id_construccion, id_usuario, estado_pedido]
    );

    // Convertir `insertId` a `Number`
    const insertId = Number((result as any).insertId);  

    res.status(201).json({ mensaje: "Pedido creado correctamente", id: insertId });
  } catch (error) {
    console.error("Error en registrarPedido:", error); 
    res.status(500).json({ mensaje: "Error al registrar pedido", error: error.message });
  }
};
