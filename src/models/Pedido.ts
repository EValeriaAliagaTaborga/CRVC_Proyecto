import pool from "../config/db";

export const getAllPedidos = async () => {
  const rows = await pool.query(`
    SELECT 
      p.id_pedido,
      p.fecha_creacion_pedido,
      p.precio_pedido,
      p.descuento_pedido,
      p.estado_pedido,
      c.direccion,
      cl.nombre_empresa AS cliente
    FROM Pedidos p
    JOIN Construcciones c ON p.id_construccion = c.id_construccion
    JOIN Clientes cl ON c.id_cliente = cl.id_cliente
    ORDER BY p.fecha_creacion_pedido DESC;
  `);
  return rows;
};

export const getDetallesByPedido = async (id_pedido: number) => {
  const rows = await pool.query(
    `
    SELECT d.*, pr.nombre_producto, pr.tipo
    FROM DetalleDePedidos d
    JOIN Productos pr ON d.id_producto = pr.id_producto
    WHERE d.id_pedido = ?
  `,
    [id_pedido]
  );
  return rows;
};

export const createPedido = async (
  id_construccion: number,
  precio: number,
  descuento: number,
  tipo_descuento: string,
  estado: string
) => {
  const result: any = await pool.query(
    `INSERT INTO Pedidos 
       (id_construccion, fecha_creacion_pedido, precio_pedido, descuento_pedido, tipo_descuento, estado_pedido)
     VALUES (?, NOW(), ?, ?, ?, ?)`,
    [id_construccion, precio, descuento, tipo_descuento, estado]
  );
  return Number(result.insertId);
};

export const createDetallePedido = async (
  id_pedido: number,
  id_producto: string,
  cantidad_pedida: number,
  fecha_estimada_entrega: string,
  precio_total: number,
  entregado: boolean = false
) => {
  await pool.query(
    `INSERT INTO DetalleDePedidos 
       (id_pedido, id_producto, cantidad_pedida, fecha_estimada_entrega, precio_total, entregado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id_pedido, id_producto, cantidad_pedida, fecha_estimada_entrega, precio_total, entregado ? 1 : 0]
  );
};


export const updateEstadoPedido = async (id: number, nuevoEstado: string) => {
  await pool.query("UPDATE Pedidos SET estado_pedido = ? WHERE id_pedido = ?", [nuevoEstado, id]);
};

export const deletePedido = async (id: number) => {
  await pool.query("DELETE FROM DetalleDePedidos WHERE id_pedido = ?", [id]);
  await pool.query("DELETE FROM Pedidos WHERE id_pedido = ?", [id]);
};

export const updateDetalleEntrega = async (id_detalle: number, entregado: boolean) => {
  await pool.query(
    `UPDATE DetalleDePedidos SET entregado = ? WHERE id_detalle_pedido = ?`,
    [entregado ? 1 : 0, id_detalle]
  );
};

export const updateDetallePedido = async (
  id_detalle: number,
  entregado: boolean,
  fecha_estimada_entrega: string
) => {
  await pool.query(
    `UPDATE DetalleDePedidos
     SET entregado = ?, fecha_estimada_entrega = ?
     WHERE id_detalle_pedido = ?`,
    [entregado ? 1 : 0, fecha_estimada_entrega, id_detalle]
  );
};

/* ==================== Helpers para Transacciones ==================== */

// Obtener conexión (mysql2/promise Pool)
export const getConnection = async (): Promise<any> => {
  // @ts-ignore - tu wrapper de pool expone getConnection en mysql2/promise
  const conn = await pool.getConnection();
  return conn;
};

export const getPedidoByIdTx = async (conn: any, id_pedido: number) => {
  const rows = await conn.query("SELECT * FROM Pedidos WHERE id_pedido = ? LIMIT 1", [id_pedido]);
  return rows[0];
};

export const getDetalleByIdTx = async (conn: any, id_detalle: number) => {
  const rows = await conn.query(
    `SELECT * FROM DetalleDePedidos WHERE id_detalle_pedido = ? LIMIT 1`,
    [id_detalle]
  );
  return rows[0];
};

export const updateDetalleEntregaTx = async (conn: any, id_detalle: number, entregado: boolean) => {
  await conn.query(
    `UPDATE DetalleDePedidos SET entregado = ? WHERE id_detalle_pedido = ?`,
    [entregado ? 1 : 0, id_detalle]
  );
};

export const countDetallesPendientesTx = async (conn: any, id_pedido: number) => {
  const rows = await conn.query(
    `SELECT COUNT(*) AS pendientes
     FROM DetalleDePedidos
     WHERE id_pedido = ? AND (entregado IS NULL OR entregado = 0)`,
    [id_pedido]
  );
  return Number(rows[0]?.pendientes ?? 0);
};

export const updateEstadoPedidoTx = async (conn: any, id_pedido: number, estado: string) => {
  await conn.query(
    `UPDATE Pedidos SET estado_pedido = ? WHERE id_pedido = ?`,
    [estado, id_pedido]
  );
};
