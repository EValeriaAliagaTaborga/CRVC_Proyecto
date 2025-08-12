import pool from "../config/db";

export const getAllProductos = async () => {
  const rows = await pool.query("SELECT * FROM Productos");
  return rows;
};

export const getProductoById = async (id: string) => {
  const rows = await pool.query("SELECT * FROM Productos WHERE id_producto = ?", [id]);
  return rows[0];
};

export const createProducto = async (id_producto:string, nombre_producto: string, tipo: string, cantidad_stock: number, precio_unitario: number) => {
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

/** Kardex: movimientos por producto */
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

/** Kardex: movimientos de TODOS los productos */
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
