import { Router } from "express";
import { obtenerConstrucciones, registrarConstruccion } from "../controllers/construccionController";
import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

router.get("/construccion", verifyToken, checkRol("1", "2"), obtenerConstrucciones);
router.post("/construccion", verifyToken, checkRol("1", "2"), registrarConstruccion);

export default router;
