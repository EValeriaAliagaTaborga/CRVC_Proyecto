// src/services/usuarioService.ts
import bcrypt from "bcrypt";
import * as UsuarioModel from "../models/Usuario";

export const obtenerUsuarios = async () => {
  return await UsuarioModel.getAllUsuarios();
};

export const obtenerUsuarioById = async (id: number) => {
  return await UsuarioModel.getUsuarioById(id);
};

export const registrarUsuario = async (nombre: string, email: string, contrasena: string, rol: number) => {
  // (opcional) validar duplicado
  const exists = await UsuarioModel.getUsuarioByEmail(email);
  if (exists) {
    throw new Error("El email ya está registrado");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(contrasena, salt);
  const id = await UsuarioModel.createUsuario(nombre, email, hashedPassword, rol);
  return { id: Number(id), nombre, email, rol, bloqueado: 0 };
};

export const editarUsuario = async (id: number, nombre: string, email: string, rol: number) => {
  await UsuarioModel.updateUsuario(id, nombre, email, rol);
};

export const setBloqueoUsuario = async (id: number, bloqueado: boolean) => {
  await UsuarioModel.setBloqueado(id, bloqueado);
};

export const eliminarUsuario = async (id: number) => {
  await UsuarioModel.deleteUsuario(id);
};

export const cambiarContrasena = async (
  id_usuario: number,
  actual: string,
  nueva: string
) => {
  const user = await UsuarioModel.getUsuarioById(id_usuario);
  if (!user) {
    const e: any = new Error("Usuario no encontrado");
    e.code = "USER_NOT_FOUND";
    throw e;
  }

  // Comparar contraseña actual
  const ok = await bcrypt.compare(actual, user.contrasena || "");
  if (!ok) {
    const e: any = new Error("La contraseña actual no es correcta");
    e.code = "INVALID_PASSWORD";
    throw e;
  }

  // Generar nuevo hash
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(nueva, salt);
  await UsuarioModel.updatePassword(id_usuario, hashed);

  return true;
};

export const forzarContrasenaAdmin = async (id_usuario: number, nueva: string) => {
  const user = await UsuarioModel.getUsuarioById(id_usuario);
  if (!user) {
    const e: any = new Error("Usuario no encontrado");
    e.code = "USER_NOT_FOUND";
    throw e;
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(nueva, salt);
  await UsuarioModel.updatePassword(id_usuario, hashed);
  return true;
};