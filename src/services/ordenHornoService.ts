import * as OrdenModel from "../models/OrdenHorno";

export const obtenerOrdenes = async () => {
  return await OrdenModel.getAllOrdenes();
};

export const registrarOrden = async (
  id_producto: number,
  id_vagon: string,
  fecha_carga: string,
  cantidad_inicial: number,
  estado: string
) => {
  return await OrdenModel.createOrden(id_producto, id_vagon, fecha_carga, cantidad_inicial, estado);
};

export const finalizarOrden = async (
  id: number,
  fecha_descarga: string,
  calidad1: number,
  calidad2: number,
  calidad3: number
) => {
  await OrdenModel.updateOrdenFinal(id, fecha_descarga, calidad1, calidad2, calidad3);
};

export const eliminarOrden = async (id: number) => {
  await OrdenModel.deleteOrden(id);
};
