import { Router } from "express";
import { generarReporte } from "../controllers/reportesController";
import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware"; // asegúrate que esté configurado

const router = Router();

router.post("/reportes", verifyToken, checkRol("1"), (req, res, next) => {
	Promise.resolve(generarReporte(req, res)).catch(next);
});

export default router;
