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
