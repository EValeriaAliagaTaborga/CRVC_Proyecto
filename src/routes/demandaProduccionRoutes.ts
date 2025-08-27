import { Router } from "express";
import { listarDemandas } from "../controllers/demandaProduccionController";
import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

// Encargados de Producción y Administradores
router.get("/produccion/demandas", verifyToken, checkRol("1","3"), listarDemandas);

export default router;
