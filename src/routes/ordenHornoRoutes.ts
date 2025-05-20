import { Router } from "express";
import {
  listarOrdenes,
  obtenerOrdenEspecifica,
  crearOrden,
  actualizarOrdenFinal,
  eliminarOrden
} from "../controllers/ordenHornoController";

import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

router.get("/produccion", verifyToken, checkRol("1", "3"), listarOrdenes);
router.get("/produccion/:id", verifyToken, checkRol("1", "3"), obtenerOrdenEspecifica);
router.post("/produccion", verifyToken, checkRol("1", "3"), crearOrden);
router.put("/produccion/:id", verifyToken, checkRol("1", "3"), actualizarOrdenFinal);
router.delete("/produccion/:id", verifyToken, checkRol("1"), eliminarOrden);

export default router;
