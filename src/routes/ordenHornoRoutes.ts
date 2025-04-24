import { Router } from "express";
import {
  listarOrdenes,
  crearOrden,
  actualizarOrdenFinal,
  eliminarOrden
} from "../controllers/ordenHornoController";

import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

router.get("/ordenes", verifyToken, checkRol("1", "3"), listarOrdenes);
router.post("/ordenes", verifyToken, checkRol("1", "3"), crearOrden);
router.put("/ordenes/:id", verifyToken, checkRol("1", "3"), actualizarOrdenFinal);
router.delete("/ordenes/:id", verifyToken, checkRol("1"), eliminarOrden);

export default router;
