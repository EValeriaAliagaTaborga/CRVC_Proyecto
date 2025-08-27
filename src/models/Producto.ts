import pool from "../config/db";

export const getAllProductos = async () => {
  const rows = await pool.query("SELECT * FROM Productos");
  return rows;
};

export const getProductoById = async (id: string) => {
  const rows = await pool.query("SELECT * FROM Productos WHERE id_producto = ?", [id]);
  return rows[0];
};

export const getProductoByNombreTipo = async (nombre: string, tipo: string) => {
  const rows = await pool.query(
    "SELECT * FROM Productos WHERE nombre_producto = ? AND tipo = ? LIMIT 1",
    [nombre, tipo]
  );
  return rows[0];
};

export const createProducto = async (
  id_producto:string,
  nombre_producto: string,
  tipo: string,
  cantidad_stock: number,
  precio_unitario: number
) => {
  const result: any = await pool.query(
    "INSERT INTO Productos (id_producto, nombre_producto, tipo, cantidad_stock, precio_unitario) VALUES (?, ?, ?, ?, ?)",
    [id_producto, nombre_producto, tipo, cantidad_stock, precio_unitario]
  );
  return Number(result.insertId);
};

export const updateProducto = async (
  id_producto: string,
  nombre_producto: string,
  tipo: string,
  cantidad_stock: number,
  precio_unitario: number
) => {
  await pool.query(
    "UPDATE Productos SET nombre_producto = ?, tipo = ?, cantidad_stock = ?, precio_unitario = ? WHERE id_producto = ?",
    [nombre_producto, tipo, cantidad_stock, precio_unitario, id_producto]
  );
};

export const deleteProducto = async (id_producto: string) => {
  await pool.query("DELETE FROM Productos WHERE id_producto = ?", [id_producto]);
};

/** ============ TX helpers ============ */

export const getProductoByIdTx = async (conn: any, id: string) => {
  const rows = await conn.query("SELECT * FROM Productos WHERE id_producto = ? LIMIT 1", [id]);
  return rows[0];
};

export const adjustStockTx = async (conn: any, id_producto: string, delta: number) => {
  await conn.query(
    `UPDATE Productos SET cantidad_stock = cantidad_stock + ? WHERE id_producto = ?`,
    [delta, id_producto]
  );
};

export const insertMovimientoTx = async (conn: any, args: {
  id_producto: string;
  tipo_movimiento: "ENTRADA" | "SALIDA";
  cantidad: number;
  motivo?: string | null;
  referencia?: string | null;
  id_usuario?: number | null;
}) => {
  const { id_producto, tipo_movimiento, cantidad, motivo = null, referencia = null, id_usuario = null } = args;
  await conn.query(
    `INSERT INTO MovimientosInventario
      (id_producto, tipo_movimiento, cantidad, motivo, referencia, id_usuario, fecha)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [id_producto, tipo_movimiento, cantidad, motivo, referencia, id_usuario]
  );
};

/** ============ Kardex lecturas ============ */

export const getMovimientosInventarioByProducto = async (
  id_producto: string,
  opts?: { tipo?: "ENTRADA" | "SALIDA" | ""; desde?: string; hasta?: string }
) => {
  const params: any[] = [id_producto];
  let sql = `
    SELECT id_movimiento, id_producto, tipo_movimiento, cantidad, motivo, referencia, id_usuario, fecha
    FROM MovimientosInventario
    WHERE id_producto = ?
  `;
  if (opts?.tipo === "ENTRADA" || opts?.tipo === "SALIDA") {
    sql += " AND tipo_movimiento = ? ";
    params.push(opts.tipo);
  }
  if (opts?.desde) { sql += " AND fecha >= ? "; params.push(`${opts.desde} 00:00:00`); }
  if (opts?.hasta) { sql += " AND fecha <= ? "; params.push(`${opts.hasta} 23:59:59`); }
  sql += " ORDER BY fecha DESC";
  const rows = await pool.query(sql, params);
  return rows;
};

export const getMovimientosInventarioAll = async (
  opts?: { tipo?: "ENTRADA" | "SALIDA" | ""; desde?: string; hasta?: string }
) => {
  const params: any[] = [];
  let sql = `
    SELECT id_movimiento, id_producto, tipo_movimiento, cantidad, motivo, referencia, id_usuario, fecha
    FROM MovimientosInventario
    WHERE 1=1
  `;
  if (opts?.tipo === "ENTRADA" || opts?.tipo === "SALIDA") {
    sql += " AND tipo_movimiento = ? ";
    params.push(opts.tipo);
  }
  if (opts?.desde) { sql += " AND fecha >= ? "; params.push(`${opts.desde} 00:00:00`); }
  if (opts?.hasta) { sql += " AND fecha <= ? "; params.push(`${opts.hasta} 23:59:59`); }
  sql += " ORDER BY id_producto ASC, fecha DESC";
  const rows = await pool.query(sql, params);
  return rows;
};
