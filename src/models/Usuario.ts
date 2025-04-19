// src/models/Usuario.ts
import pool from "../config/db";

export const getAllUsuarios = async () => {
  const rows = await pool.query("SELECT * FROM Usuarios");
  return rows;
};

export const getUsuarioById = async (id: number) => {
  const rows = await pool.query("SELECT * FROM Usuarios WHERE id_usuario = ?", [id]);
  return rows[0];
};

export const createUsuario = async (nombre: string, email: string, contrasena: string, rol: number) => {
  const result = await pool.query(
    "INSERT INTO Usuarios (nombre, email, contrasena, id_rol) VALUES (?, ?, ?, ?)",
    [nombre, email, contrasena, rol]
  );
  return result.insertId;
};

export const updateUsuario = async (id: number, nombre: string, email: string, rol: number) => {
  await pool.query(
    "UPDATE Usuarios SET nombre = ?, email = ?, id_rol = ? WHERE id_usuario = ?",
    [nombre, email, rol, id]
  );
};

export const deleteUsuario = async (id: number) => {
  await pool.query("DELETE FROM Usuarios WHERE id_usuario = ?", [id]);
};
