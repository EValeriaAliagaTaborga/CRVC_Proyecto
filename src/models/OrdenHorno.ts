import pool from "../config/db";
import { getProductoByNombreTipo } from "./Producto";

export const getAllOrdenes = async () => {
  const rows = await pool.query(`SELECT * FROM OrdenesProduccion`);
  return rows;
};

export const getOrdenById = async (id: number) => {
  const rows = await pool.query(`SELECT * FROM OrdenesProduccion WHERE id_orden = ?`, [id]);
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

  if (estado === "Finalizado") {
    const ordenRows: any = await pool.query(
      "SELECT nombre_producto FROM OrdenesProduccion WHERE id_orden = ?",
      [id]
    );
    const nombre_producto = ordenRows[0]?.nombre_producto;

    const updates = [
      { tipo: "Primera", cantidad: Number(calidad1) || 0 },
      { tipo: "Segunda", cantidad: Number(calidad2) || 0 },
      { tipo: "Tercera", cantidad: Number(calidad3) || 0 },
    ];

    for (const upd of updates) {
      if (!upd.cantidad) continue;

      // 1) Aumentar stock
      await pool.query(
        `UPDATE Productos 
         SET cantidad_stock = cantidad_stock + ?
         WHERE nombre_producto = ? AND tipo = ?`,
        [upd.cantidad, nombre_producto, upd.tipo]
      );

      // 2) Kardex (ENTRADA)
      const prod = await getProductoByNombreTipo(nombre_producto, upd.tipo);
      if (prod?.id_producto) {
        await pool.query(
          `INSERT INTO MovimientosInventario
           (id_producto, tipo_movimiento, cantidad, motivo, referencia, id_usuario, fecha)
           VALUES (?, 'ENTRADA', ?, 'Producción finalizada', ?, NULL, NOW())`,
          [prod.id_producto, upd.cantidad, `Orden ${id}`]
        );
      }
    }
  }
};

export const deleteOrden = async (id: number) => {
  await pool.query("DELETE FROM OrdenesProduccion WHERE id_orden = ?", [id]);
};
