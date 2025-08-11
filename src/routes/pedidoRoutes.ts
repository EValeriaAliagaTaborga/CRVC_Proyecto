import { Router } from "express";
import {
  listarPedidos,
  crearPedido,
  actualizarEstadoPedido,
  eliminarPedido,
  actualizarEntregaDetalle,
  actualizarDetallePedido
} from "../controllers/pedidoController";

import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";
import { extraerUsuarioId } from "../middleware/extraerUsuarioIdMiddleware";

const router = Router();

router.get("/pedidos", verifyToken, checkRol("1", "2"), listarPedidos);
router.post("/pedidos", verifyToken, checkRol("1", "2"), extraerUsuarioId, crearPedido);
router.put("/pedidos/:id/estado", verifyToken, checkRol("1", "2"), extraerUsuarioId, actualizarEstadoPedido);
router.patch("/pedidos/:id/detalle/:detalleId/entrega", verifyToken, checkRol("1", "2"), extraerUsuarioId, actualizarEntregaDetalle);
router.delete("/pedidos/:id", verifyToken, checkRol("1"), extraerUsuarioId, eliminarPedido);
router.patch(
  "/pedidos/detalles/:detalleId",
  verifyToken,
  checkRol("1","2"),
  extraerUsuarioId,
  actualizarDetallePedido
);

export default router;
