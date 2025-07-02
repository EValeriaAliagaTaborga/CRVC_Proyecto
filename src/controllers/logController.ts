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

export const obtenerLogsRecientesController = async (_req: Request, res: Response) => {
  try {
    const logs = await logService.obtenerLogsRecientes();
    res.status(201).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener logs", error });
  }
};
