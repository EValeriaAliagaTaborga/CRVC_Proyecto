import pool from "../config/db";

export const getAllOrdenes = async () => {
  const rows = await pool.query(`
    SELECT o.*, p.nombre_producto
    FROM OrdenesProduccion o
    JOIN Productos p ON o.id_producto = p.id_producto
  `);
  return rows;
};

export const createOrden = async (
  id_producto: number,
  id_vagon: string,
  fecha_carga: string,
  cantidad_inicial: number,
  estado: string
) => {
  const result: any = await pool.query(
    `INSERT INTO OrdenesProduccion 
     (id_producto, id_vagon, fecha_de_carga, cantidad_inicial_por_producir, estado)
     VALUES (?, ?, ?, ?, ?)`,
    [id_producto, id_vagon, fecha_carga, cantidad_inicial, estado]
  );
  return Number(result.insertId);
};

export const updateOrdenFinal = async (
  id: number,
  fecha_descarga: string,
  calidad1: number,
  calidad2: number,
  calidad3: number
) => {
  await pool.query(
    `UPDATE OrdenesProduccion
     SET fecha_de_descarga = ?, cantidad_final_calidad_primera = ?, 
         cantidad_final_calidad_segunda = ?, cantidad_final_calidad_tercera = ?
     WHERE id_orden = ?`,
    [fecha_descarga, calidad1, calidad2, calidad3, id]
  );
};

export const deleteOrden = async (id: number) => {
  await pool.query("DELETE FROM OrdenesProduccion WHERE id_orden = ?", [id]);
};
