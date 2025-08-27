import * as NotiModel from "../models/Notificacion";

export const crearNotifRol = async (target_rol: string, titulo: string, mensaje?: string) =>
  NotiModel.createNotification({ target_rol, titulo, mensaje });

export const crearNotifUsuario = async (id_usuario: number, titulo: string, mensaje?: string) =>
  NotiModel.createNotification({ id_usuario, titulo, mensaje });

export const listarNotificacionesUsuario = async (userId: number, rol: string) =>
  NotiModel.listForUser(userId, rol);

export const marcarLeida = async (id: number, userId: number) =>
  NotiModel.markAsRead(id, userId);
