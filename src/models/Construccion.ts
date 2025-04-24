import pool from "../config/db";

export const getAllConstrucciones = async () => {
  const rows = await pool.query("SELECT c.*, cl.nombre_empresa FROM Construcciones c JOIN Clientes cl ON c.id_cliente = cl.id_cliente");
  return rows;
};

export const getConstruccionById = async (id: number) => {
  const rows = await pool.query("SELECT * FROM Construcciones WHERE id_construccion = ?", [id]);
  return rows[0];
};

export const createConstruccion = async (id_cliente: number, direccion: string, estado_obra: string, nombre_contacto_obra: string, celular_contacto_obra: string) => {
  const result = await pool.query(
    "INSERT INTO Construcciones (id_cliente, direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra) VALUES (?, ?, ?, ?, ?)",
    [id_cliente, direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra]
  );
  return result.insertId;
};

export const updateConstruccion = async (
  id_construccion: number,
  direccion: string,
  estado_obra: string,
  nombre_contacto_obra: string,
  celular_contacto_obra: string
) => {
  await pool.query(
    "UPDATE Construcciones SET direccion = ?, estado_obra = ?, nombre_contacto_obra = ?, celular_contacto_obra =? WHERE id_construccion = ?",
    [direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra, id_construccion]
  );
};

export const deleteConstruccion = async (id_construccion: number) => {
  await pool.query("DELETE FROM Construcciones WHERE id_construccion = ?", [id_construccion]);
};

export const buscarConstrucciones = async ({
  cliente,
  direccion,
  estado
}: {
  cliente?: string;
  direccion?: string;
  estado?: string;
}) => {
  let sql = `
    SELECT c.*, cl.nombre_empresa AS nombre_cliente
    FROM Construcciones c
    JOIN Clientes cl ON c.id_cliente = cl.id_cliente
    WHERE 1 = 1
  `;
  const params: any[] = [];

  if (cliente) {
    sql += " AND cl.nombre_empresa LIKE ?";
    params.push(`%${cliente}%`);
  }

  if (direccion) {
    sql += " AND c.direccion LIKE ?";
    params.push(`%${direccion}%`);
  }

  if (estado) {
    sql += " AND c.estado_obra = ?";
    params.push(estado);
  }

  const rows = await pool.query(sql, params);
  return rows;
};