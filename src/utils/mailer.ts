// src/utils/mailer.ts
import nodemailer from "nodemailer";

const {
  SMTP_HOST = "smtp.gmail.com",
  SMTP_PORT = "465",
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM = "no-reply@crvc.local",
} = process.env;

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,       // SSL en 465, STARTTLS en 587
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

export async function sendMail(opts: { to: string; subject: string; html: string }) {
  return transporter.sendMail({ from: SMTP_FROM, ...opts });
}
