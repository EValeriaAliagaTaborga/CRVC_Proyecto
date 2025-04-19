import { Request, Response } from "express";
import pool from "../config/db";

// Obtener todos las construcciones
export const obtenerConstrucciones = async (_req: Request, res: Response) => {
  try {
    const construcciones = await pool.query("SELECT * FROM Construcciones");
    res.json(construcciones);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener Construcciones", error: error.message });
  }
};

// Crear un nueva construccion
export const registrarConstruccion = async (req: Request, res: Response) => {
  try {
    const { id_cliente, direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!id_cliente || !direccion || !estado_obra || !nombre_contacto_obra || !celular_contacto_obra) {
        res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        return;
      }

    const existing = await pool.query(
      "SELECT * FROM Construcciones WHERE direccion = ?",
      [direccion]
    );

    if (existing !== undefined && existing.length > 0) {
      res.status(409).json({ message: "Ya hay una construccion con la misma direccion registrada" });
      return;
    }
  
    const result = await pool.query(
      "INSERT INTO Construcciones (id_cliente, direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra) VALUES (?, ?, ?, ?, ?)",
      [id_cliente, direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra]
    );

    // Convertir `insertId` a `Number`
    const insertId = Number((result as any).insertId);  

    res.status(201).json({ mensaje: "Construccion creado correctamente", id: insertId });
  } catch (error) {
    console.error("Error en registrarConstruccion:", error); 
    res.status(500).json({ mensaje: "Error al registrar construccion", error: error.message });
  }
};
