import { Request, Response } from "express";
import pool from "../config/db";

// Obtener Productos en Stock
export const obtenerProductos = async (_req: Request, res: Response) => {
  try {
    const stock = await pool.query("SELECT * FROM Productos");
    res.json(stock);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener Stock", error: error.message });
  }
};

// Crear un nuevo producto
export const registrarProducto = async (req: Request, res: Response) => {
  try {
    const { id_product, nombre_producto, precio_unitario, cantidad_stock, tipo } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!id_product || !nombre_producto || !precio_unitario || !cantidad_stock || !tipo ) {
        res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        return;
      }

    const existing = await pool.query(
      "SELECT * FROM Productos WHERE nombre_producto = ?",
      [nombre_producto]
    );

    if (existing !== undefined && existing.length > 0) {
      res.status(409).json({ message: "El producto ya está registrado" });
      return;
    }
  
    const result = await pool.query(
      "INSERT INTO Productos (id_product, nombre_producto, precio_unitario, cantidad_stock, tipo) VALUES (?, ?, ?, ?, ?)",
      [id_product, nombre_producto, precio_unitario, cantidad_stock, tipo]
    );

    // Convertir `insertId` a `Number`
    const insertId = Number((result as any).insertId);  

    res.status(201).json({ mensaje: "Producto creado correctamente", id: insertId });
  } catch (error) {
    console.error("Error en registrarProducto:", error); 
    res.status(500).json({ mensaje: "Error al registrar nuevo producto", error: error.message });
  }
};
