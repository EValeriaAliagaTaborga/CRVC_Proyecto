// src/middleware/extraerUsuarioId.ts
import { Request, Response, NextFunction } from "express";

export const extraerUsuarioId = (req: Request, res: Response, next: NextFunction) => {
  const usuario = (req as any).usuario;
  if (!usuario || !usuario.id) {
    res.status(400).json({ message: "ID de usuario no disponible para registrar acción." });
    return;
  }

  (req as any).id_usuario_token = usuario.id;
  next();
};
