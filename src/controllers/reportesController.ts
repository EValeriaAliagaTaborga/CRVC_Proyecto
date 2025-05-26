import { Request, Response } from "express";
import { generarReportePedidos, generarReporteProduccion } from "../services/reportesService";

export const generarReporte = async (req: Request, res: Response) => {
  const { tipo, formato, fecha_inicio, fecha_fin } = req.body;

  if (!["pedidos", "produccion"].includes(tipo) || !["pdf", "xlsx"].includes(formato)) {
    return res.status(400).json({ message: "Parámetros inválidos" });
  }

  try {
    const { buffer, nombreArchivo } =
      tipo === "pedidos"
        ? await generarReportePedidos(fecha_inicio, fecha_fin, formato)
        : await generarReporteProduccion(fecha_inicio, fecha_fin, formato);

    res.setHeader("Content-Disposition", `attachment; filename=${nombreArchivo}`);
    res.setHeader(
      "Content-Type",
      formato === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("❌ Error al generar reporte:", error);
    res.status(500).json({ message: "Error al generar reporte", error: error.message });
  }
};
