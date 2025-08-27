import { Router } from "express";
import { testEmail } from "../controllers/devMailController";
// opcional: importa verifyToken + checkRol si quieres protegerlo
const router = Router();

// TEMP: sin auth para prueba local. Luego protégelo o elimínalo.
router.post("/_dev/test-email", testEmail);

export default router;
