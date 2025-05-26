import { Request, Response } from "express";
import * as logService from "../services/logService";
import { Log } from "../models/Logs";

export const crearLogController = async (req: Request, res: Response) => {
  try {
    const log: Log = req.body;
    await logService.crearLog(log);
    res.status(201).json({ message: "Log guardado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar log", error });
  }
};

export const obtenerLogsRecientesController = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const logs = await logService.obtenerLogsRecientes(limit);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener logs", error });
  }
};
