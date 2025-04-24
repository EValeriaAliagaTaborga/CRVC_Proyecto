import { Request, Response } from "express";
import * as OrdenService from "../services/ordenHornoService";

export const listarOrdenes = async (_req: Request, res: Response) => {
  try {
    const ordenes = await OrdenService.obtenerOrdenes();
    res.json(ordenes);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener órdenes", error: error.message });
  }
};

export const crearOrden = async (req: Request, res: Response) => {
  try {
    const { id_producto, id_vagon, fecha_de_carga, cantidad_inicial_por_producir, estado } = req.body;
    const id = await OrdenService.registrarOrden(id_producto, id_vagon, fecha_de_carga, cantidad_inicial_por_producir, estado);
    res.status(201).json({ message: "Orden registrada correctamente", id_orden: id });
  } catch (error: any) {
    res.status(500).json({ message: "Error al registrar orden", error: error.message });
  }
};

export const actualizarOrdenFinal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fecha_de_descarga, calidad_primera, calidad_segunda, calidad_tercera } = req.body;
    await OrdenService.finalizarOrden(Number(id), fecha_de_descarga, calidad_primera, calidad_segunda, calidad_tercera);
    res.json({ message: "Orden de producción actualizada correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar orden", error: error.message });
  }
};

export const eliminarOrden = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await OrdenService.eliminarOrden(Number(id));
    res.json({ message: "Orden eliminada correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar orden", error: error.message });
  }
};
