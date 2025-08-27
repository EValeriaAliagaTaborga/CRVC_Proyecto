import crypto from "crypto";
import bcrypt from "bcrypt";
import * as UsuarioModel from "../models/Usuario";
import * as PRModel from "../models/PasswordReset";
import { sendMail } from "../utils/mailer";

const BASE_URL = process.env.APP_BASE_URL || "http://localhost:5173";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const solicitarReset = async (email: string) => {
  const user = await UsuarioModel.getUsuarioByEmail(email);
  // Seguridad: no revelar si existe o no
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
  const expiraStr = expira.toISOString().slice(0, 19).replace("T", " ");

  await PRModel.createReset(user.id, tokenHash, expiraStr);

  const url = `${BASE_URL}/restablecer?token=${token}`;
  const html = `
    <div style="font-family:Arial,sans-serif">
      <h2>Restablecer contraseña</h2>
      <p>Hola ${user.nombre || ""}, recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente botón para continuar. Este enlace expira en 1 hora.</p>
      <p style="margin:16px 0">
        <a href="${url}" style="background:#2563eb;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">
          Restablecer contraseña
        </a>
      </p>
      <p>Si no solicitaste este cambio, ignora este mensaje.</p>
    </div>
  `;
  await sendMail({ to: user.email, subject: "Restablecer contraseña", html });
};

export const restablecerContrasena = async (token: string, nueva: string) => {
  const tokenHash = hashToken(token);
  const row = await PRModel.getByTokenHash(tokenHash);
  if (!row) throw new Error("Token inválido");

  if (row.usado) throw new Error("El token ya fue usado");
  if (new Date(row.expira_en).getTime() < Date.now()) throw new Error("El token ha expirado");

  const user = await UsuarioModel.getUsuarioById(row.id_usuario);
  if (!user) throw new Error("Usuario no existe");

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(nueva, salt);
  await UsuarioModel.updatePassword(user.id, hashed);
  await PRModel.markUsed(row.id);
};
