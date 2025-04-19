// src/services/usuarioService.ts
import bcrypt from "bcrypt";
import * as UsuarioModel from "../models/Usuario";

export const obtenerUsuarios = async () => {
  return await UsuarioModel.getAllUsuarios();
};

export const registrarUsuario = async (nombre: string, email: string, contrasena: string, rol: number) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(contrasena, salt);
  const id = await UsuarioModel.createUsuario(nombre, email, hashedPassword, rol);
  return { id, nombre, email, rol };
};

export const editarUsuario = async (id: number, nombre: string, email: string, rol: number) => {
  await UsuarioModel.updateUsuario(id, nombre, email, rol);
};

export const eliminarUsuario = async (id: number) => {
  await UsuarioModel.deleteUsuario(id);
};
