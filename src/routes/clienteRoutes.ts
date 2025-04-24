// src/routes/clienteRoutes.ts
import { Router } from "express";
import {
  listarClientes,
  obtenerClienteEspecifico,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from "../controllers/clienteController";

import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

router.get("/clientes", verifyToken, checkRol("1", "2"), listarClientes);
router.get("/clientes/:id", verifyToken, checkRol("1"), obtenerClienteEspecifico);
router.post("/clientes", verifyToken, checkRol("1", "2"), crearCliente);
router.put("/clientes/:id", verifyToken, checkRol("1", "2"), actualizarCliente);
router.delete("/clientes/:id", verifyToken, checkRol("1"), eliminarCliente);

export default router;
