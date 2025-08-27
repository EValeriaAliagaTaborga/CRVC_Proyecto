import pool from "../config/db";

export const upsertDemanda = async (args: {
  id_producto: string;
  nombre_producto: string;
  tipo: string;
  cantidad: number;
  fecha_objetivo?: string | null; // ISO YYYY-MM-DD
}) => {
  const { id_producto, nombre_producto, tipo, cantidad, fecha_objetivo } = args;

  // Si existe, acumula cantidad y toma la fecha objetivo mínima
  const rows: any[] = await pool.query(
    "SELECT * FROM DemandasProduccion WHERE id_producto = ?",
    [id_producto]
  );

  if (rows.length > 0) {
    const current = rows[0];
    const minFecha =
      fecha_objetivo && current.fecha_objetivo
        ? (new Date(fecha_objetivo) < new Date(current.fecha_objetivo) ? fecha_objetivo : current.fecha_objetivo)
        : (fecha_objetivo || current.fecha_objetivo);

    await pool.query(
      `UPDATE DemandasProduccion
       SET cantidad_pendiente = cantidad_pendiente + ?,
           fecha_objetivo = ?
       WHERE id_producto = ?`,
      [cantidad, minFecha, id_producto]
    );
  } else {
    await pool.query(
      `INSERT INTO DemandasProduccion
       (id_producto, nombre_producto, tipo, cantidad_pendiente, fecha_objetivo)
       VALUES (?, ?, ?, ?, ?)`,
      [id_producto, nombre_producto, tipo, cantidad, fecha_objetivo || null]
    );
  }
};

export const listDemandas = async () => {
  const rows = await pool.query(
    `SELECT * FROM DemandasProduccion ORDER BY fecha_objetivo IS NULL, fecha_objetivo ASC, actualizado_en DESC`
  );
  return rows;
};
