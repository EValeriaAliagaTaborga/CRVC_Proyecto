import pool from "../config/db";

export const createReset = async (id_usuario: number, token_hash: string, expira_en: string) => {
  await pool.query(
    "INSERT INTO PasswordResets (id_usuario, token_hash, expira_en) VALUES (?, ?, ?)",
    [id_usuario, token_hash, expira_en]
  );
};

export const getByTokenHash = async (token_hash: string) => {
  const rows = await pool.query("SELECT * FROM PasswordResets WHERE token_hash = ? LIMIT 1", [token_hash]);
  return rows[0];
};

export const markUsed = async (id: number) => {
  await pool.query("UPDATE PasswordResets SET usado = 1 WHERE id = ?", [id]);
};
