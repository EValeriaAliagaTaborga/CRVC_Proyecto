import express from "express";
import { obtenerUsuarios, crearUsuario } from "../controllers/usuarioController";
import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = express.Router();

router.get("/usuarios", verifyToken, checkRol("1"), obtenerUsuarios);
router.post("/usuarios", verifyToken, checkRol("1"), crearUsuario);

export default router;