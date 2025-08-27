import { Request, Response } from "express";
import * as DemandaService from "../services/demandaProduccionService";

export const listarDemandas = async (_req: Request, res: Response) => {
  try {
    const rows = await DemandaService.obtenerDemandas();
    res.json(rows);
  } catch (error: any) {
    console.error("Error /produccion/demandas:", error?.code || error?.message || error);
    res.status(500).json({ message: "Error al obtener demandas", error: error.message });
  }
};
