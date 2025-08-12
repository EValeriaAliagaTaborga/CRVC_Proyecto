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

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get("/pedidos", verifyToken, checkRol("1", "2"), asyncHandler(listarPedidos));
router.post("/pedidos", verifyToken, checkRol("1", "2"), extraerUsuarioId, asyncHandler(crearPedido));
router.put("/pedidos/:id/estado", verifyToken, checkRol("1", "2"), extraerUsuarioId, asyncHandler(actualizarEstadoPedido));
router.patch("/pedidos/:id/detalle/:detalleId/entrega", verifyToken, checkRol("1", "2"), extraerUsuarioId, asyncHandler(actualizarEntregaDetalle));
router.delete("/pedidos/:id", verifyToken, checkRol("1"), extraerUsuarioId, asyncHandler(eliminarPedido));
router.patch(
  "/pedidos/detalles/:detalleId",
  verifyToken,
  checkRol("1","2"),
  extraerUsuarioId,
  asyncHandler(actualizarDetallePedido)
);

export default router;
