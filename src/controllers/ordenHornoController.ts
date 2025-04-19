import { Request, Response } from "express";
import pool from "../config/db";

// Obtener todas las ordenes de horno
export const obtenerOrdenesHorno = async (_req: Request, res: Response) => {
  try {
    const ordenes = await pool.query("SELECT * FROM OrdenesHorno");
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener ordenes de horno", error: error.message });
  }
};

// Crear un nueva orden de horno
export const registrarOrdenHorno = async (req: Request, res: Response) => {
  try {
    const { id_producto, id_vagon, fecha_de_carga, cantidad_inicial_por_producir, estado } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!id_producto || !id_vagon || !fecha_de_carga  || !cantidad_inicial_por_producir || !estado ) {
      res.status(400).json({ mensaje: "id_producto, id_vagon, fecha_de_carga, cantidad_inicial_por_producir, estado son obligatorios" });
      return;
    }
  
    const result = await pool.query(
      "INSERT INTO OrdenesHorno (id_producto, id_vagon, fecha_de_carga, cantidad_inicial_por_producir, estado) VALUES (?, ?, ?, ?, ?)",
      [id_producto, id_vagon, fecha_de_carga, cantidad_inicial_por_producir, estado]
    );

    // Convertir `insertId` a `Number`
    const insertId = Number((result as any).insertId);  

    res.status(201).json({ mensaje: "Orden de horno creada correctamente", id: insertId });
  } catch (error) {
    console.error("Error en registrarCliente:", error); 
    res.status(500).json({ mensaje: "Error al registrar orden de horno", error: error.message });
  }
};
