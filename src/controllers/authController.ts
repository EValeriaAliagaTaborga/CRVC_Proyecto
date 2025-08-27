import { Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as PasswordResetService from "../services/passwordResetService";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, contrasena } = req.body;

    // Validar que se envíen los datos
    if (!email || !contrasena) {
       res.status(400).json({ message: "Email y contraseña son requeridos" });
       return;
    }

    // Buscar usuario en la base de datos
    const [rows]: any = await pool.query("SELECT * FROM Usuarios WHERE email = ?", [email]);
    console.log("🔍 Resultado SQL:", rows);

    if (!rows || rows.length === 0) {
       res.status(401).json({ message: "Credenciales incorrectas" });
       return;
    }

    const usuario = Array.isArray(rows) ? rows[0] : rows;

    console.log("📌 Usuario encontrado:", usuario);
    console.log("🔑 Contraseña en la BD:", usuario?.contrasena);
    console.log("🔑 Contraseña ingresada:", contrasena);

    if (!usuario.contrasena) {
        res.status(500).json({ message: "Error interno del servidor" });
        return;
      }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordMatch) {
      res.status(401).json({ message: "Credenciales incorrectas" });
      return;
    }

    // Generar access token JWT
    const accessToken  = jwt.sign(
        { id: usuario.id_usuario.toString(),
          rol: usuario.id_rol.toString(),
          nombre: usuario.nombre.toString(),
          email: usuario.email.toString()
         },
        process.env.JWT_SECRET || "defaultSecret",
        { expiresIn: (process.env.JWT_EXPIRATION || "1h") as jwt.SignOptions["expiresIn"] }
    );

    // Generar refresh token JWT
    const refreshToken = jwt.sign(
      { id: usuario.id_usuario.toString(),
        rol: usuario.id_rol.toString(),
        nombre: usuario.nombre.toString(),
        email: usuario.email.toString()
       },
      process.env.JWT_REFRESH_SECRET || "refreshSecret",
      { expiresIn: (process.env.JWT_REFRESH_EXPIRATION || "7d")  as jwt.SignOptions["expiresIn"] }
    );

    // Guardar el refresh token en la BD
    await pool.query("INSERT INTO RefreshTokens (token, user_id) VALUES (?, ?)", [refreshToken, usuario.id_usuario]);

    res.json({ message: "Inicio de sesión exitoso", accessToken, refreshToken, usuario: { id: usuario.id_usuario, rol: usuario.id_rol, nombre: usuario.nombre } });

  } catch (error) {
    console.error("Error en loginUser:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const refreshAccessToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
     res.status(401).json({ message: "Refresh token requerido" });
     return;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refreshSecret"
    ) as { id: string };

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: (process.env.JWT_EXPIRATION || "1h") as jwt.SignOptions["expiresIn"] }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Refresh token inválido", error: error.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token requerido" });
    return;
  }

  try {
    // Eliminar el token de la base de datos
    await pool.query("DELETE FROM RefreshTokens WHERE token = ?", [refreshToken]);

    res.json({ message: "Sesión cerrada exitosamente" });
    return;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({ message: "Error del servidor", error: error.message });
    return;
  }
};

/** POST /api/auth/password/solicitar */
export const solicitarResetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    if (!email)  res.status(400).json({ message: "Email requerido" });

    await PasswordResetService.solicitarReset(email);

    // Respuesta neutral para no filtrar usuarios
    res.json({ message: "Si el correo existe, se envió un enlace de restablecimiento." });
  } catch (err: any) {
    res.status(500).json({ message: "No se pudo procesar la solicitud", error: err.message });
  }
};

/** POST /api/auth/password/restablecer */
export const restablecerPassword = async (req: Request, res: Response) => {
  try {
    const { token, nueva_contrasena } = req.body as { token: string; nueva_contrasena: string };
    if (!token || !nueva_contrasena) {
       res.status(400).json({ message: "Faltan parámetros" });
    }
    if (nueva_contrasena.length < 6) {
       res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    await PasswordResetService.restablecerContrasena(token, nueva_contrasena);
    res.json({ message: "Contraseña actualizada" });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "No se pudo restablecer" });
  }
};