import { Request, Response } from "express";
import pool from "../config/db";

// Obtener todos los clientes
export const obtenerClientes = async (_req: Request, res: Response) => {
  try {
    const clientes = await pool.query("SELECT * FROM Clientes");
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener clientes", error: error.message });
  }
};

// Crear un nuevo usuario
export const registrarCliente = async (req: Request, res: Response) => {
  try {
    const { nombre_empresa, nombre_contacto, telefono_fijo, celular, email } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!nombre_empresa || !nombre_contacto || !celular ) {
        res.status(400).json({ mensaje: "Nombre empresa, nombre contacto y celular son obligatorios" });
        return;
      }

    const existing = await pool.query(
      "SELECT * FROM Clientes WHERE nombre_empresa = ?",
      [nombre_empresa]
    );

    if (existing !== undefined && existing.length > 0) {
      res.status(409).json({ message: "El cliente ya está registrado" });
      return;
    }
  
    const result = await pool.query(
      "INSERT INTO Clientes (nombre_empresa, nombre_contacto, telefono_fijo, celular, email) VALUES (?, ?, ?, ?, ?)",
      [nombre_empresa, nombre_contacto, telefono_fijo, celular, email]
    );

    // Convertir `insertId` a `Number`
    const insertId = Number((result as any).insertId);  

    res.status(201).json({ mensaje: "Cliente creado correctamente", id: insertId });
  } catch (error) {
    console.error("Error en registrarCliente:", error); 
    res.status(500).json({ mensaje: "Error al registrar cliente", error: error.message });
  }
};
