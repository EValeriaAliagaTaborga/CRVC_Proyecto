import { Request, Response } from "express";
import { sendMail } from "../utils/mailer";

export const testEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, html } = req.body as { to: string; subject?: string; html?: string };
    if (!to) res.status(400).json({ message: "Campo 'to' es requerido" });

    await sendMail({
      to,
      subject: subject || "Prueba SMTP CRVC",
      html: html || "<p>¡Funciona! 🚀</p>",
    });
    res.json({ ok: true, message: "Correo enviado" });
  } catch (err: any) {
    res.status(500).json({ message: "Fallo al enviar correo", error: err?.message });
  }
};
