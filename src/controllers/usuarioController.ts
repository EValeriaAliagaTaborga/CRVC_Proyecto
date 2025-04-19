import { Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcrypt";

// Obtener todos los usuarios
export const obtenerUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await pool.query("SELECT * FROM Usuarios");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error });
  }
};

// Crear un nuevo usuario
export const crearUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, contrasena, id_rol } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!nombre || !email || !contrasena || !id_rol) {
        res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        return;
      }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);
    
    const result = await pool.query(
      "INSERT INTO Usuarios (nombre, email, contrasena, id_rol) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, id_rol]
    );

    // Convertir `insertId` a `Number`
    const insertId = Number((result as any).insertId);  

    res.status(201).json({ mensaje: "Usuario creado correctamente", id: insertId });
  } catch (error) {
    console.error("Error en createUser:", error); 
    res.status(500).json({ mensaje: "Error al crear usuario", error: error.message });
  }
};
