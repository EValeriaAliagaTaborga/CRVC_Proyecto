import pool from "../config/db";

export const getAllOrdenes = async () => {
  const rows = await pool.query(`
    SELECT o.*, p.nombre_producto
    FROM OrdenesProduccion o
    JOIN Productos p ON o.nombre_producto = p.nombre_producto
  `);
  return rows;
};

export const getOrdenById = async (id: number) => {
  const rows = await pool.query(`SELECT o.*, p.nombre_producto
    FROM OrdenesProduccion o
    JOIN Productos p ON o.nombre_producto = p.nombre_producto WHERE o.id_orden = ?`, [id]);
  return rows[0];
};

export const createOrden = async (
  nombre_producto: string,
  id_vagon: string,
  fecha_carga: string,
  cantidad_inicial: number,
  estado: string
) => {
  const result: any = await pool.query(
    `INSERT INTO OrdenesProduccion 
     (nombre_producto, id_vagon, fecha_carga, cantidad_inicial_por_producir, estado_orden)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre_producto, id_vagon, fecha_carga, cantidad_inicial, estado]
  );
  return Number(result.insertId);
};

export const updateOrdenFinal = async (
  id: number,
  fecha_descarga: string,
  calidad1: number,
  calidad2: number,
  calidad3: number,
  estado: string
) => {
  await pool.query(
    `UPDATE OrdenesProduccion
     SET fecha_descarga = ?, cantidad_final_calidad_primera = ?, 
         cantidad_final_calidad_segunda = ?, cantidad_final_calidad_tercera = ?,
         estado_orden = ?
     WHERE id_orden = ?`,
    [fecha_descarga, calidad1, calidad2, calidad3, estado, id]
  );

  // 2. Solo si el estado es "Finalizado"
  if (estado === "Finalizado") {
    // Obtener el nombre_producto de la orden
    const [ordenRows]: any = await pool.query(
      "SELECT nombre_producto FROM OrdenesProduccion WHERE id_orden = ?",
      [id]
    );

    const nombre_producto = ordenRows[0]?.nombre_producto;

    // Actualizar productos por tipo de calidad
    const updates = [
      {
        tipo: "Primera",
        cantidad: calidad1
      },
      {
        tipo: "Segunda",
        cantidad: calidad2
      },
      {
        tipo: "Tercera",
        cantidad: calidad3
      }
    ];

    for (const update of updates) {
      await pool.query(
        `UPDATE Productos 
         SET cantidad_stock = cantidad_stock + ?
         WHERE nombre_producto = ? AND tipo = ?`,
        [update.cantidad, nombre_producto, update.tipo]
      );
    }
  }
};

export const deleteOrden = async (id: number) => {
  await pool.query("DELETE FROM OrdenesProduccion WHERE id_orden = ?", [id]);
};
