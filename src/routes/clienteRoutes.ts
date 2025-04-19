import { Router } from "express";
import { obtenerClientes, registrarCliente } from "../controllers/clienteController";
import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";

const router = Router();

router.get("/clientes", verifyToken, checkRol("1", "2"), obtenerClientes);
router.post("/clientes", verifyToken, checkRol("1", "2"), registrarCliente);

export default router;
