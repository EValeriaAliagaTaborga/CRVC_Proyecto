import { Log } from "../models/Logs";
import pool from "../config/db";

export const crearLog = async (log: Log): Promise<void> => {
  const { id_usuario, accion, detalle } = log;
  await pool.query(
    "INSERT INTO logs (id_usuario, accion, detalle) VALUES (?, ?, ?)",
    [id_usuario, accion, detalle]
  );
};

export const obtenerLogsRecientes = async (limit: number = 10): Promise<any[]> => {
  const [rows] = await pool.query(
    `SELECT logs.*, usuarios.nombre_usuario 
     FROM logs 
     JOIN usuarios ON logs.id_usuario = usuarios.id_usuario 
     ORDER BY fecha DESC 
     LIMIT ?`,
    [limit]
  );
  return rows as any[];
};
