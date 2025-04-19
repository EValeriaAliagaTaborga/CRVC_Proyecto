import { Router } from "express";
import { obtenerProductos, registrarProducto } from "../controllers/productoController";
import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

router.get("/productos", verifyToken, checkRol("1", "3"), obtenerProductos);
router.post("/productos", verifyToken, checkRol("1", "3"), registrarProducto);

export default router;
