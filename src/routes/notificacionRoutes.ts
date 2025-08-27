import { Router } from "express";
import { listarNotificaciones, marcarComoLeida } from "../controllers/notificacionController";
import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

// Todos los roles autenticados pueden ver las suyas
router.get("/notificaciones", verifyToken, checkRol("1","2","3"), listarNotificaciones);
router.patch("/notificaciones/:id/leida", verifyToken, checkRol("1","2","3"), marcarComoLeida);

export default router;
