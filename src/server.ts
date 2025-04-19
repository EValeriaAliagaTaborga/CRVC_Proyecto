import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/usuarioRoutes";
import authRoutes from "./routes/authRoutes";
import clientRoutes from "./routes/clienteRoutes";
import construccionRoutes from "./routes/construccionRoutes";
import productoRoutes from "./routes/productoRoutes";
import detallePedidoRoutes from "./routes/detallePedidoRoutes";
import hornoRoutes from "./routes/ordenHornoRoutes";

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
app.use("/api", productoRoutes);
app.use("/api", detallePedidoRoutes);
app.use("/api", hornoRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});