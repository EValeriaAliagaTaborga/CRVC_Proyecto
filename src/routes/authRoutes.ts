import { Router } from "express";
import { loginUser, refreshAccessToken, logoutUser  } from "../controllers/authController";
import { solicitarResetPassword, restablecerPassword } from "../controllers/authController";

const router = Router();

// Ruta para iniciar sesión
router.post("/login", loginUser);
// Ruta para refresh token
router.post("/refresh", refreshAccessToken);
// Ruta para cerrar sesión
router.post("/logout", logoutUser);
router.post("/password/solicitar", solicitarResetPassword);
router.post("/password/restablecer", restablecerPassword);

export default router;
