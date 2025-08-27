// src/models/Usuario.ts
import pool from "../config/db";

async function ensureBloqueadoColumn() {
  // Crea la columna 'bloqueado' si no existe (tinyint 0/1)
  await pool.query(`
    ALTER TABLE Usuarios
    ADD COLUMN IF NOT EXISTS bloqueado TINYINT(1) NOT NULL DEFAULT 0
  `);
}

export const getAllUsuarios = async () => {
  await ensureBloqueadoColumn();
  const rows = await pool.query("SELECT id_usuario AS id, nombre, email, id_rol, bloqueado FROM Usuarios");
  return rows;
};

export const getUsuarioById = async (id: number) => {
  await ensureBloqueadoColumn();
  const rows = await pool.query("SELECT id_usuario AS id, nombre, email, id_rol, bloqueado, contrasena FROM Usuarios WHERE id_usuario = ?", [id]);
  return rows[0];
};

export const getUsuarioByEmail = async (email: string) => {
  await ensureBloqueadoColumn();
  const rows = await pool.query("SELECT id_usuario AS id, nombre, email, id_rol, bloqueado, contrasena FROM Usuarios WHERE email = ? LIMIT 1", [email]);
  return rows[0];
};

export const createUsuario = async (nombre: string, email: string, contrasena: string, rol: number) => {
  await ensureBloqueadoColumn();
  const result: any = await pool.query(
    "INSERT INTO Usuarios (nombre, email, contrasena, id_rol, bloqueado) VALUES (?, ?, ?, ?, 0)",
    [nombre, email, contrasena, rol]
  );
  return result.insertId;
};

export const updateUsuario = async (id: number, nombre: string, email: string, rol: number) => {
  await ensureBloqueadoColumn();
  await pool.query(
    "UPDATE Usuarios SET nombre = ?, email = ?, id_rol = ? WHERE id_usuario = ?",
    [nombre, email, rol, id]
  );
};

export const setBloqueado = async (id: number, bloqueado: boolean) => {
  await ensureBloqueadoColumn();
  await pool.query("UPDATE Usuarios SET bloqueado = ? WHERE id_usuario = ?", [bloqueado ? 1 : 0, id]);
};

export const deleteUsuario = async (id: number) => {
  await ensureBloqueadoColumn();
  await pool.query("DELETE FROM Usuarios WHERE id_usuario = ?", [id]);
};

export const updatePassword = async (id: number, passwordHash: string) => {
  await ensureBloqueadoColumn();
  await pool.query("UPDATE Usuarios SET contrasena = ? WHERE id_usuario = ?", [passwordHash, id]);
};
