import { Router } from "express";
import { obtenerPedido, registrarPedido } from "../controllers/pedidoController";
import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

router.get("/pedidos", verifyToken, checkRol("1", "2"), obtenerPedido);
router.post("/pedidos", verifyToken, checkRol("1", "2"), registrarPedido);

export default router;
