import { Request, Response, NextFunction } from "express";

export const checkRol = (...requiredRole: String[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = (req as any).usuario;

    if (!usuario || !requiredRole.includes(usuario.rol)) {
        console.log("Rol requerido:", requiredRole, "Rol del usuario:", usuario.rol);
        res.status(403).json({ message: "Acceso denegado: rol insuficiente"});
        return;
    }

    next();
  };
};