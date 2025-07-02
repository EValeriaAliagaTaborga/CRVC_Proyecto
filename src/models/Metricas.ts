import pool from "../config/db";

export const obtenerProductosMasVendidos = async () => {
  const rows = await pool.query(`
    SELECT 
      p.nombre_producto, p.tipo, 
      SUM(dp.cantidad_pedida) AS total_vendido
    FROM DetalleDePedidos dp
    JOIN Productos p ON dp.id_producto = p.id_producto
    GROUP BY dp.id_producto
    ORDER BY total_vendido DESC
    LIMIT 5
  `);
  return rows;
};

export const obtenerIngresosMensuales = async () => {
  const rows = await pool.query(`
    SELECT 
      DATE_FORMAT(fecha_creacion_pedido, '%Y-%m') AS mes, 
      SUM(precio_pedido - (precio_pedido * descuento_pedido / 100)) AS ingresos
    FROM Pedidos
    GROUP BY mes
    ORDER BY mes DESC
    LIMIT 12
  `);
  return rows;
};

export const obtenerPromedioDescuento = async () => {
  const rows = await pool.query(`
    SELECT 
      AVG(descuento_pedido) AS promedio_descuento
    FROM Pedidos
  `);
  return rows;
};

// 1. Pérdida por orden
export const getPerdidaPorOrden = async () => {
  const rows = await pool.query(`
    SELECT 
      id_orden,
      nombre_producto,
      cantidad_inicial_por_producir AS cantidad_inicial,
      cantidad_final_calidad_primera,
      cantidad_final_calidad_segunda,
      cantidad_final_calidad_tercera,
      ROUND(
        100 * (
          1 - (
            IFNULL(cantidad_final_calidad_primera, 0) +
            IFNULL(cantidad_final_calidad_segunda, 0) +
            IFNULL(cantidad_final_calidad_tercera, 0)
          ) / cantidad_inicial_por_producir
        ),
        2
      ) AS porcentaje_perdida
    FROM OrdenesProduccion
    WHERE cantidad_inicial_por_producir > 0
  `);
  return rows;
};

// 2. Producción por calidad mensual
export const getProduccionPorCalidadMensual = async () => {
  const rows = await pool.query(`
    SELECT 
      DATE_FORMAT(fecha_descarga, '%Y-%m') AS mes,
      SUM(IFNULL(cantidad_final_calidad_primera, 0)) AS primera,
      SUM(IFNULL(cantidad_final_calidad_segunda, 0)) AS segunda,
      SUM(IFNULL(cantidad_final_calidad_tercera, 0)) AS tercera
    FROM OrdenesProduccion
    WHERE fecha_descarga IS NOT NULL
    GROUP BY mes
    ORDER BY mes ASC
  `);
  return rows;
};

// 3. Promedio de pérdida mensual
export const getPromedioPerdidaPorMes = async () => {
  const rows = await pool.query(`
    SELECT 
      DATE_FORMAT(fecha_descarga, '%Y-%m') AS mes,
      ROUND(AVG(
        100 * (
          1 - (
            IFNULL(cantidad_final_calidad_primera, 0) +
            IFNULL(cantidad_final_calidad_segunda, 0) +
            IFNULL(cantidad_final_calidad_tercera, 0)
          ) / cantidad_inicial_por_producir
        )
      ), 2) AS promedio_perdida
    FROM OrdenesProduccion
    WHERE cantidad_inicial_por_producir > 0 AND fecha_descarga IS NOT NULL
    GROUP BY mes
    ORDER BY mes ASC
  `);
  return rows;
};

export const getKPIs = async () => {
  const [{ total_vendidos }] = await pool.query(`
    SELECT SUM(cantidad_pedida) as total_vendidos FROM DetalleDePedidos
  `);

  const [{ total_ingresos }] = await pool.query(`
    SELECT SUM(precio_pedido) as total_ingresos FROM Pedidos
  `);

  const [{ total_pedidos }] = await pool.query(`
    SELECT COUNT(*) as total_pedidos FROM Pedidos
  `);

  const [{ tasa_perdida }] = await pool.query(`
    SELECT 
      AVG((
        cantidad_inicial_por_producir - 
        IFNULL(cantidad_final_calidad_primera, 0) -
        IFNULL(cantidad_final_calidad_segunda, 0) -
        IFNULL(cantidad_final_calidad_tercera, 0)
      ) / cantidad_inicial_por_producir) * 100 AS tasa_perdida
    FROM OrdenesProduccion
    WHERE cantidad_inicial_por_producir > 0
  `);

  return {
    total_vendidos: Number(total_vendidos || 0),
    total_ingresos: Number(total_ingresos || 0),
    total_pedidos: Number(total_pedidos || 0),
    tasa_perdida: Number(tasa_perdida || 0)
  };
};

export const getDistribucionPedidosPorEstado = async () => {
  const rows = await pool.query(`
    SELECT estado_pedido AS estado, COUNT(*) AS cantidad
    FROM Pedidos
    GROUP BY estado_pedido
  `);
  
  // Convertir BigInt a Number para evitar errores de serialización
  const parsed = rows.map((row) => ({
    estado: row.estado,
    cantidad: Number(row.cantidad),
  }));

  return parsed;
};

export const getTasaFinalizacionOrdenes = async () => {
  const [{ total }] = await pool.query(`SELECT COUNT(*) AS total FROM OrdenesProduccion`);
  const [{ finalizadas }] = await pool.query(`
    SELECT COUNT(*) AS finalizadas
    FROM OrdenesProduccion
    WHERE estado_orden = 'Finalizado'
  `);

  const porcentaje = Number(total) > 0 ? (Number(finalizadas) / Number(total)) * 100 : 0;

  return {
    total_ordenes: Number(total || 0),
    ordenes_finalizadas: Number(finalizadas || 0),
    tasa_finalizacion: Number(porcentaje || 0.00)
  };
};

export const getPedidosDetallados = async () => {
  const rows = await pool.query(`
    SELECT 
      p.id_pedido,
      p.fecha_creacion_pedido,
      p.estado_pedido,
      p.precio_pedido,
      cl.nombre_empresa AS cliente,
      c.direccion AS construccion
    FROM Pedidos p
    JOIN Construcciones c ON p.id_construccion = c.id_construccion
    JOIN Clientes cl ON c.id_cliente = cl.id_cliente
    ORDER BY p.fecha_creacion_pedido DESC
  `);
  return rows;
};

export const getPedidosPorClienteConstruccion = async () => {
  const rows = await pool.query(`
    SELECT 
      p.id_pedido,
      cl.nombre_empresa AS cliente,
      c.direccion AS construccion,
      p.fecha_creacion_pedido,
      p.precio_pedido,
      p.descuento_pedido,
      p.estado_pedido
    FROM Pedidos p
    JOIN Construcciones c ON p.id_construccion = c.id_construccion
    JOIN Clientes cl ON c.id_cliente = cl.id_cliente
    ORDER BY p.fecha_creacion_pedido DESC
  `);
  return rows;
};


export const getOrdenesProduccionDetalladas = async () => {
  const rows = await pool.query(`
    SELECT 
      id_orden,
      nombre_producto,
      id_vagon,
      fecha_carga,
      fecha_descarga,
      cantidad_inicial_por_producir,
      cantidad_final_calidad_primera,
      cantidad_final_calidad_segunda,
      cantidad_final_calidad_tercera,
      estado_orden
    FROM OrdenesProduccion
    ORDER BY fecha_carga DESC
  `);
  return rows;
};

export const getMermasPorTipoLadrillo = async () => {
  const rows = await pool.query(`
    SELECT 
      nombre_producto,
      SUM(cantidad_inicial_por_producir) AS total_inicial,
      SUM(IFNULL(cantidad_final_calidad_primera, 0) +
          IFNULL(cantidad_final_calidad_segunda, 0) +
          IFNULL(cantidad_final_calidad_tercera, 0)) AS total_final,
      SUM(cantidad_inicial_por_producir -
          (IFNULL(cantidad_final_calidad_primera, 0) +
           IFNULL(cantidad_final_calidad_segunda, 0) +
           IFNULL(cantidad_final_calidad_tercera, 0))) AS total_merma,
      ROUND(
        100 * SUM(cantidad_inicial_por_producir -
          (IFNULL(cantidad_final_calidad_primera, 0) +
           IFNULL(cantidad_final_calidad_segunda, 0) +
           IFNULL(cantidad_final_calidad_tercera, 0))) 
        / SUM(cantidad_inicial_por_producir), 2
      ) AS porcentaje_merma
    FROM OrdenesProduccion
    WHERE cantidad_inicial_por_producir > 0
    GROUP BY nombre_producto
    ORDER BY porcentaje_merma DESC
  `);
  return rows;
};
