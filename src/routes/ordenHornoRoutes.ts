import { Router } from "express";
import {
  listarOrdenes,
  obtenerOrdenEspecifica,
  crearOrden,
  actualizarOrdenFinal,
  eliminarOrden
} from "../controllers/ordenHornoController";

import { listarDemandas } from "../controllers/demandaProduccionController";

import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";
import { extraerUsuarioId } from "../middleware/extraerUsuarioIdMiddleware";

const router = Router();

// Demandas de producción (visible para admin, vendedor y encargado de producción)
router.get("/produccion/demandas", verifyToken, checkRol("1", "2", "3"), listarDemandas);

router.get("/produccion", verifyToken, checkRol("1", "3"), listarOrdenes);
router.get("/produccion/:id", verifyToken, checkRol("1", "3"), obtenerOrdenEspecifica);
router.post("/produccion", verifyToken, checkRol("1", "3"), extraerUsuarioId, crearOrden);
router.put("/produccion/:id", verifyToken, checkRol("1", "3"), extraerUsuarioId, actualizarOrdenFinal);
router.delete("/produccion/:id", verifyToken, checkRol("1"), extraerUsuarioId, eliminarOrden);

export default router;
