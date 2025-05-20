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

export const obtenerOrdenEspecifica = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;
      const orden = await OrdenService.obtenerOrdenById(Number(id));
      res.json(orden);
    } catch (error: any) {
      res.status(500).json({ message: "Error al obtener orden", error: error.message });
    }
  };

export const crearOrden = async (req: Request, res: Response) => {
  try {
    const { id_producto, id_vagon, fecha_carga, cantidad_inicial_por_producir, estado_orden } = req.body;
    const id = await OrdenService.registrarOrden(id_producto, id_vagon, fecha_carga, cantidad_inicial_por_producir, estado_orden);
    res.status(201).json({ message: "Orden registrada correctamente", id_orden: id });
  } catch (error: any) {
    res.status(500).json({ message: "Error al registrar orden", error: error.message });
  }
};

export const actualizarOrdenFinal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fecha_descarga, cantidad_final_calidad_primera, cantidad_final_calidad_segunda, cantidad_final_calidad_tercera, estado_orden } = req.body;
    await OrdenService.finalizarOrden(Number(id), fecha_descarga, cantidad_final_calidad_primera, cantidad_final_calidad_segunda, cantidad_final_calidad_tercera, estado_orden);
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
