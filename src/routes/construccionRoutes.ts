import { Router } from "express";
import {
  listarConstrucciones,
  obtenerConstruccionEspecifica,
  crearConstruccion,
  actualizarConstruccion,
  eliminarConstruccion,
  buscarConstrucciones
} from "../controllers/construccionController";

import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

router.get("/construcciones", verifyToken, checkRol("1", "2"), listarConstrucciones);
router.get("/construcciones/:id", verifyToken, checkRol("1","2"), obtenerConstruccionEspecifica);
router.post("/construcciones", verifyToken, checkRol("1", "2"), crearConstruccion);
router.put("/construcciones/:id", verifyToken, checkRol("1", "2"), actualizarConstruccion);
router.delete("/construcciones/:id", verifyToken, checkRol("1"), eliminarConstruccion);
router.get("/construcciones/buscar", verifyToken, buscarConstrucciones);

export default router;
