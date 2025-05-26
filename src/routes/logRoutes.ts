import { Router } from "express";
import {
  crearLogController,
  obtenerLogsRecientesController
} from "../controllers/logController";

const router = Router();

router.post("/", crearLogController);
router.get("/", obtenerLogsRecientesController);

export default router;
