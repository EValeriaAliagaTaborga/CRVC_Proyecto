// src/routes/usuarioRoutes.ts
import { Router } from "express";
import {
  listarUsuarios,
  obtenerUsuarioEspecifico,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from "../controllers/usuarioController";

import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware"; // asegúrate que esté configurado

const router = Router();

router.get("/usuarios", verifyToken, checkRol("1"), listarUsuarios);
router.get("/usuarios/:id", verifyToken, checkRol("1"), obtenerUsuarioEspecifico);
router.post("/usuarios", verifyToken, checkRol("1"), crearUsuario);
router.put("/usuarios/:id", verifyToken, checkRol("1"), actualizarUsuario);
router.delete("/usuarios/:id", verifyToken, checkRol("1"), eliminarUsuario);

export default router;
