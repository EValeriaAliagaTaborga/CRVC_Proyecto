import * as OrdenModel from "../models/OrdenHorno";

export const obtenerOrdenes = async () => OrdenModel.getAllOrdenes();
export const obtenerOrdenById = async (id: number) => OrdenModel.getOrdenById(id);

export const registrarOrden = async (
  nombre_producto: string,
  id_vagon: string,
  fecha_carga: string,
  cantidad_inicial: number,
  estado: string
) => OrdenModel.createOrden(nombre_producto, id_vagon, fecha_carga, cantidad_inicial, estado);

export const finalizarOrden = async (
  id: number,
  fecha_descarga: string,
  calidad1: number,
  calidad2: number,
  calidad3: number,
  estado: string
) => OrdenModel.updateOrdenFinal(id, fecha_descarga, calidad1, calidad2, calidad3, estado);

export const eliminarOrden = async (id: number) => OrdenModel.deleteOrden(id);
