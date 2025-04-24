import { Router } from "express";
import {
  listarPedidos,
  crearPedido,
  actualizarEstadoPedido,
  eliminarPedido
} from "../controllers/pedidoController";

import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

router.get("/pedidos", verifyToken, checkRol("1", "2"), listarPedidos);
router.post("/pedidos", verifyToken, checkRol("1", "2"), crearPedido);
router.put("/pedidos/:id/estado", verifyToken, checkRol("1", "2"), actualizarEstadoPedido);
router.delete("/pedidos/:id", verifyToken, checkRol("1"), eliminarPedido);

export default router;
