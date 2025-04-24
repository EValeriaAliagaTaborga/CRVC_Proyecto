// src/models/Cliente.ts
import pool from "../config/db";

export const getAllClientes = async () => {
  const rows = await pool.query("SELECT * FROM Clientes");
  return rows;
};

export const getClienteById = async (id: number) => {
  const rows = await pool.query("SELECT * FROM Clientes WHERE id_cliente = ?", [id]);
  return rows[0];
};

export const createCliente = async (nombre_empresa: string, nombre_contacto: string, telefono_fijo: string, celular: string, email: string) => {
  const result = await pool.query(
    "INSERT INTO Clientes (nombre_empresa, nombre_contacto, telefono_fijo, celular, email) VALUES (?, ?, ?, ?, ?)",
    [nombre_empresa, nombre_contacto, telefono_fijo, celular, email]
  );
  return result.insertId;
};

export const updateCliente = async (id: number, nombre_empresa: string, nombre_contacto: string, telefono_fijo: string, celular: string, email: string) => {
  await pool.query(
    "UPDATE Clientes SET nombre_empresa = ?, nombre_contacto = ?, telefono_fijo = ?, celular = ?, email = ? WHERE id_cliente = ?",
    [nombre_empresa, nombre_contacto, telefono_fijo, celular, email, id]
  );
};

export const deleteCliente = async (id: number) => {
  await pool.query("DELETE FROM Clientes WHERE id_cliente = ?", [id]);
};
