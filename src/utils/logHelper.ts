// src/utils/logHelper.ts
import { crearLog } from "../services/logService";

export const registrarLog = async (id_usuario: number, accion: string, detalle?: string) => {
  try {
    await crearLog({ id_usuario, accion, detalle });
  } catch (error) {
    console.error("Error al registrar log:", error);
  }
};
