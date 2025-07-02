import { Router } from "express";
import {
  listarPedidos,
  crearPedido,
  actualizarEstadoPedido,
  eliminarPedido
} from "../controllers/pedidoController";

import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";
import { extraerUsuarioId } from "../middleware/extraerUsuarioIdMiddleware";

const router = Router();

router.get("/pedidos", verifyToken, checkRol("1", "2"), listarPedidos);
router.post("/pedidos", verifyToken, checkRol("1", "2"), extraerUsuarioId, crearPedido);
router.put("/pedidos/:id/estado", verifyToken, checkRol("1", "2"), extraerUsuarioId, actualizarEstadoPedido);
router.delete("/pedidos/:id", verifyToken, checkRol("1"), extraerUsuarioId, eliminarPedido);

export default router;
