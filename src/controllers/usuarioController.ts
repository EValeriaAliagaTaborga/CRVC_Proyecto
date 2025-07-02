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
      res.json(usuario);
    } catch (error: any) {
      res.status(500).json({ message: "Error al obtener usuario", error: error.message });
    }
  };

export const crearUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, contrasena, id_rol } = req.body;
    const nuevo = await UsuarioService.registrarUsuario(nombre, email, contrasena, id_rol);

    // Registrar log
    const id_usuario_log = (req as any).usuario.id;
    await registrarLog(id_usuario_log, "Creación de Usuario", `Usuario creado: ${nombre}`);

    res.status(201).json({ message: "Usuario creado correctamente", usuario: nuevo });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, email, id_rol } = req.body;
    await UsuarioService.editarUsuario(Number(id), nombre, email, id_rol);

    // Registrar log
    const id_usuario_log = (req as any).usuario.id;
    await registrarLog(id_usuario_log, "Actualizar informacion de Usuario", `Usuario actualizado: ${nombre}`);


    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await UsuarioService.eliminarUsuario(Number(id));

    // Registrar log
    const id_usuario_log = (req as any).usuario.id;
    await registrarLog(id_usuario_log, "Eliminar Usuario", `Usuario eliminado: ${id}`);

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};
