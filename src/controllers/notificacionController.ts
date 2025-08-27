import { Request, Response } from "express";
import * as NotiService from "../services/notificacionService";

export const listarNotificaciones = async (req: Request, res: Response) => {
  try {
    const user = (req as any).usuario; // { id, rol }
    const notifs = await NotiService.listarNotificacionesUsuario(user.id, String(user.rol));
    res.json(notifs);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener notificaciones", error: error.message });
  }
};

export const marcarComoLeida = async (req: Request, res: Response) => {
  try {
    const user = (req as any).usuario;
    const { id } = req.params;
    await NotiService.marcarLeida(Number(id), user.id);
    res.json({ message: "Notificación marcada como leída" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al marcar como leída", error: error.message });
  }
};
