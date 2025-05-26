import pool from "../config/db";

export const obtenerPedidosPorFechas = async (fechaInicio: string, fechaFin: string) => {
  const rows: any = await pool.query(
    `SELECT p.id_pedido, p.fecha_creacion_pedido AS fecha_pedido, c.nombre_empresa AS nombre_cliente, p.estado_pedido
     FROM Pedidos p
     JOIN Construcciones co ON p.id_construccion = co.id_construccion
     JOIN Clientes c ON co.id_cliente = c.id_cliente
     WHERE p.fecha_creacion_pedido BETWEEN ? AND ?`,
    [fechaInicio, fechaFin]
  );
  return rows;
};

export const obtenerOrdenesProduccionPorFechas = async (fechaInicio: string, fechaFin: string) => {
  const rows: any = await pool.query(
    `SELECT id_orden, nombre_producto, fecha_carga, fecha_descarga, estado_orden
     FROM OrdenesProduccion
     WHERE fecha_carga BETWEEN ? AND ?`,
    [fechaInicio, fechaFin]
  );
  return rows;
};
