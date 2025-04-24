import { Request, Response } from "express";
import * as ConstruccionService from "../services/construccionService";

export const listarConstrucciones = async (_req: Request, res: Response) => {
  try {
    const construcciones = await ConstruccionService.obtenerConstrucciones();
    res.json(construcciones);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener construcciones", error: error.message });
  }
};

export const obtenerConstruccionEspecifica = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const construccion = await ConstruccionService.obteneConstruccionById(Number(id));
    res.json(construccion);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener construccion", error: error.message });
  }
};

export const crearConstruccion = async (req: Request, res: Response) => {
  try {
    const { id_cliente, direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra } = req.body;
    const nueva = await ConstruccionService.registrarConstruccion(id_cliente, direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra);
    res.status(201).json({ message: "Construcción registrada correctamente", construccion: nueva });
  } catch (error: any) {
    res.status(500).json({ message: "Error al registrar construcción", error: error.message });
  }
};

export const actualizarConstruccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra } = req.body;
    await ConstruccionService.editarConstruccion(Number(id), direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra);
    res.json({ message: "Construcción actualizada correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar construcción", error: error.message });
  }
};

export const eliminarConstruccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ConstruccionService.eliminarConstruccion(Number(id));
    res.json({ message: "Construcción eliminada correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar construcción", error: error.message });
  }
};

export const buscarConstrucciones = async (req: Request, res: Response) => {
  try {
    const { cliente, direccion, estado } = req.query;

    const construcciones = await ConstruccionService.buscarConstrucciones({
      cliente: cliente as string,
      direccion: direccion as string,
      estado: estado as string
    });

    res.json(construcciones);
  } catch (error: any) {
    res.status(500).json({ message: "Error al buscar construcciones", error: error.message });
  }
};
