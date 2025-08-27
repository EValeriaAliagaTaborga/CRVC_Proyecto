// src/controllers/usuarioController.ts
import { Request, Response } from "express";
import * as UsuarioService from "../services/usuarioService";
import { registrarLog } from "../utils/logHelper";

export const listarUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await UsuarioService.obtenerUsuarios();
    res.json(usuarios);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

export const obtenerUsuarioEspecifico = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioService.obtenerUsuarioById(Number(id));
    if (!usuario) res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener usuario", error: error.message });
  }
};

export const crearUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, contrasena, id_rol } = req.body;
    const nuevo = await UsuarioService.registrarUsuario(nombre, email, contrasena, Number(id_rol));

    const id_usuario_log = (req as any).usuario.id;
    await registrarLog(id_usuario_log, "Creación de Usuario", `Usuario creado: ${nombre}`);

    res.status(201).json({ message: "Usuario creado correctamente", usuario: nuevo });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error al crear usuario" });
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, email, id_rol } = req.body;
    await UsuarioService.editarUsuario(Number(id), nombre, email, Number(id_rol));

    const id_usuario_log = (req as any).usuario.id;
    await registrarLog(id_usuario_log, "Actualizar Usuario", `Usuario actualizado: ${nombre}`);

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

export const actualizarBloqueoUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { bloqueado } = req.body as { bloqueado: boolean };

    await UsuarioService.setBloqueoUsuario(Number(id), !!bloqueado);

    const id_usuario_log = (req as any).usuario.id;
    await registrarLog(
      id_usuario_log,
      bloqueado ? "Bloquear Usuario" : "Desbloquear Usuario",
      `Usuario: ${id}`
    );

    res.json({ message: bloqueado ? "Usuario bloqueado" : "Usuario desbloqueado" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar bloqueo", error: error.message });
  }
};

export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await UsuarioService.eliminarUsuario(Number(id));

    const id_usuario_log = (req as any).usuario.id;
    await registrarLog(id_usuario_log, "Eliminar Usuario", `Usuario eliminado: ${id}`);

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};

export const cambiarContrasenaUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // id del usuario a cambiar
    const { actual, nueva } = req.body as { actual: string; nueva: string };

    if (!actual || !nueva) {
       res.status(400).json({ message: "Faltan parámetros" });
    }
    if (String(nueva).length < 6) {
       res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres" });
    }

    const requester = (req as any).usuario; // del middleware verifyToken
    // Solo el dueño o el administrador pueden cambiar
    if (!requester || (Number(requester.id) !== Number(id) && requester.rol !== "1")) {
       res.status(403).json({ message: "No autorizado" });
    }

    await UsuarioService.cambiarContrasena(Number(id), actual, nueva);

    // Log
    try {
      await registrarLog(requester.id, "Cambio de contraseña", `Usuario ${id}`);
    } catch {}

    res.json({ message: "Contraseña actualizada" });
  } catch (error: any) {
    if (error.code === "INVALID_PASSWORD") {
       res.status(400).json({ message: "La contraseña actual no es correcta" });
    }
    if (error.code === "USER_NOT_FOUND") {
       res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(500).json({ message: "No se pudo actualizar la contraseña", error: error.message });
  }
};

export const forzarContrasenaUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // usuario objetivo
    const { nueva } = req.body as { nueva: string };

    if (!nueva || String(nueva).length < 6) {
       res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres" });
    }

    const requester = (req as any).usuario;
    if (!requester || requester.rol !== "1") {
       res.status(403).json({ message: "Solo un Administrador puede forzar el cambio de contraseña" });
    }

    await UsuarioService.forzarContrasenaAdmin(Number(id), nueva);

    try {
      await registrarLog(requester.id, "Forzar cambio de contraseña", `Usuario ${id}`);
    } catch {}

    res.json({ message: "Contraseña actualizada (forzada)" });
  } catch (error: any) {
    if (error.code === "USER_NOT_FOUND") {
       res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(500).json({ message: "No se pudo forzar la contraseña", error: error.message });
  }
};