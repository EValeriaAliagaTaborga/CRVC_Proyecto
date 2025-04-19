import { Router } from "express";
import { obtenerDetallesPedido, registrarDetallePedido } from "../controllers/detallePedidoController";
import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

router.get("/pedidos/detalle", verifyToken, checkRol("1", "2"), obtenerDetallesPedido);
router.post("/pedidos/detalle", verifyToken, checkRol("1", "2"), registrarDetallePedido);

export default router;
