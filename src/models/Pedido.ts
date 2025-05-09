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
  const rows = await pool.query(`
    SELECT d.*, pr.nombre_producto
    FROM DetalleDePedidos d
    JOIN Productos pr ON d.id_producto = pr.id_producto
    WHERE d.id_pedido = ?
  `, [id_pedido]);
  return rows;
};

export const createPedido = async (
  id_construccion: number,
  precio: number,
  descuento: number,
  estado: string
) => {
  const result: any = await pool.query(`
    INSERT INTO Pedidos (id_construccion, fecha_creacion_pedido, precio_pedido, descuento_pedido, estado_pedido)
    VALUES (?, NOW(), ?, ?, ?)`,
    [id_construccion, precio, descuento, estado]
  );
  return Number(result.insertId);
};

export const createDetallePedido = async (
  id_pedido: number,
  id_producto: number,
  cantidad_pedida: number,
  fecha_estimada_entrega: string,
  precio_total: number
) => {
  await pool.query(`
    INSERT INTO DetalleDePedidos (id_pedido, id_producto, cantidad_pedida, fecha_estimada_entrega, precio_total)
    VALUES (?, ?, ?, ?, ?)`,
    [id_pedido, id_producto, cantidad_pedida, fecha_estimada_entrega, precio_total]
  );
};

export const updateEstadoPedido = async (id: number, nuevoEstado: string) => {
  await pool.query("UPDATE Pedidos SET estado_pedido = ? WHERE id_pedido = ?", [nuevoEstado, id]);
};

export const deletePedido = async (id: number) => {
  await pool.query("DELETE FROM DetalleDePedidos WHERE id_pedido = ?", [id]);
  await pool.query("DELETE FROM Pedidos WHERE id_pedido = ?", [id]);
};
