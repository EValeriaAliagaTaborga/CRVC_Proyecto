import { Log } from "../models/Logs";
import pool from "../config/db";

export const crearLog = async (log: Log): Promise<void> => {
  const { id_usuario, accion, detalle } = log;
  await pool.query(
    "INSERT INTO logs (id_usuario, accion, detalle) VALUES (?, ?, ?)",
    [id_usuario, accion, detalle]
  );
};

export const obtenerLogsRecientes = async (): Promise<any[]> => {
  const rows = await pool.query(
    `SELECT logs.*, u.nombre AS nombre_usuario, r.nombre_rol AS rol
      FROM logs
      JOIN usuarios u ON logs.id_usuario = u.id_usuario
      JOIN roles r ON u.id_rol = r.id_rol
      ORDER BY fecha DESC`
  );
  return rows;
};
