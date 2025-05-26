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

const router = Router();

router.get("/productos", verifyToken, checkRol("1","2","3"), listarProductos);
router.get("/productos/:id", verifyToken, checkRol("1","2","3"), obtenerProductoEspecifico);
router.post("/productos", verifyToken, checkRol("1","3"), crearProducto);
router.put("/productos/:id", verifyToken, checkRol("1","3"), actualizarProducto);
router.delete("/productos/:id", verifyToken, checkRol("1","3"), eliminarProducto);

export default router;
