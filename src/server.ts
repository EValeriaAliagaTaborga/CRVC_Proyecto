import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/usuarioRoutes";
import authRoutes from "./routes/authRoutes";
import clientRoutes from "./routes/clienteRoutes";
import construccionRoutes from "./routes/construccionRoutes";
import productoRoutes from "./routes/productoRoutes";
import pedidoRoutes from "./routes/pedidoRoutes";
import hornoRoutes from "./routes/ordenHornoRoutes";
import reportesRoutes from "./routes/reportesRoutes";
import logRoutes from "./routes/logRoutes";
import metricasRoutes from "./routes/metricasRoutes";
import demandaProduccionRoutes from "./routes/demandaProduccionRoutes";
import notificacionRoutes from "./routes/notificacionRoutes";

import devMailRoutes from "./routes/devMailRoutes";

dotenv.config();

console.log("🔐 JWT_EXPIRATION:", process.env.JWT_EXPIRATION);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", clientRoutes);
app.use("/api", construccionRoutes);
app.use("/api", demandaProduccionRoutes);
app.use("/api", notificacionRoutes);
app.use("/api", productoRoutes);
app.use("/api", pedidoRoutes);
app.use("/api", hornoRoutes);
app.use("/api", reportesRoutes);
app.use("/api/logs", logRoutes);
app.use("/api", metricasRoutes);

app.use("/api", devMailRoutes);


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});