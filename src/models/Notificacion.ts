import pool from "../config/db";

export const createNotification = async (args: {
  id_usuario?: number | null;
  target_rol?: string | null; // "3"
  titulo: string;
  mensaje?: string | null;
}) => {
  const { id_usuario = null, target_rol = null, titulo, mensaje = null } = args;
  await pool.query(
    `INSERT INTO Notificaciones (id_usuario, target_rol, titulo, mensaje) VALUES (?, ?, ?, ?)`,
    [id_usuario, target_rol, titulo, mensaje]
  );
};

export const listForUser = async (userId: number, userRol: string) => {
  const rows = await pool.query(
    `SELECT * FROM Notificaciones
     WHERE (id_usuario = ? OR (target_rol IS NOT NULL AND target_rol = ?))
     ORDER BY creada_en DESC`,
    [userId, userRol]
  );
  return rows;
};

export const markAsRead = async (id: number, userId: number) => {
  await pool.query(
    `UPDATE Notificaciones
     SET leida = 1
     WHERE id_notificacion = ? AND (id_usuario = ? OR id_usuario IS NULL)`,
    [id, userId]
  );
};
