import { Router } from "express";
import {
  listarProductos,
  obtenerProductoEspecifico,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productoController";

import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";
import { extraerUsuarioId } from "../middleware/extraerUsuarioIdMiddleware";

const router = Router();

router.get("/productos", verifyToken, checkRol("1","2","3"), listarProductos);
router.get("/productos/:id", verifyToken, checkRol("1","2","3"), obtenerProductoEspecifico);
router.post("/productos", verifyToken, checkRol("1","3"), extraerUsuarioId, crearProducto);
router.put("/productos/:id", verifyToken, checkRol("1","3"), extraerUsuarioId, actualizarProducto);
router.delete("/productos/:id", verifyToken, checkRol("1","3"), extraerUsuarioId, eliminarProducto);

export default router;
