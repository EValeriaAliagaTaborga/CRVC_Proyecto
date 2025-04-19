import { Router } from "express";
import { obtenerOrdenesHorno, registrarOrdenHorno } from "../controllers/ordenHornoController";
import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

router.get("/horno", verifyToken, checkRol("1", "3"), obtenerOrdenesHorno);
router.post("/horno", verifyToken, checkRol("1", "3"), registrarOrdenHorno);

export default router;
