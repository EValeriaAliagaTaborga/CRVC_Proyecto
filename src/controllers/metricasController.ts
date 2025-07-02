import { Request, Response } from "express";
import * as MetricasService from "../services/metricasService";

export const productosMasVendidos = async (_req: Request, res: Response) => {
  try {
    const data = await MetricasService.getProductosMasVendidos();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener productos más vendidos", error: error.message });
  }
};

export const ingresosPorMes = async (_req: Request, res: Response) => {
  try {
    const data = await MetricasService.getIngresosMensuales();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener ingresos mensuales", error: error.message });
  }
};

export const promedioDescuento = async (_req: Request, res: Response) => {
  try {
    const data = await MetricasService.getPromedioDescuento();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener promedio de descuento", error: error.message });
  }
};

export const getPerdidasPorOrden = async (_req: Request, res: Response) => {
  try {
    const data = await MetricasService.obtenerPerdidasPorOrden();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener pérdidas por orden", error: error.message });
  }
};

export const getProduccionCalidadMensual = async (_req: Request, res: Response) => {
  try {
    const data = await MetricasService.obtenerProduccionCalidadMensual();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener producción por calidad", error: error.message });
  }
};

export const getPromedioPerdidaMensual = async (_req: Request, res: Response) => {
  try {
    const data = await MetricasService.obtenerPromedioPerdidaMensual();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener promedio de pérdida", error: error.message });
  }
};

export const getKPIs = async (_req: Request, res: Response) => {
  try {
    const kpis = await MetricasService.obtenerKPIs();
    res.status(200).json(kpis);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener KPIs", error: error.message });
  }
};

export const getDistribucionPedidos = async (_req: Request, res: Response) => {
  try {
    const data = await MetricasService.obtenerDistribucionPedidos();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener distribución de pedidos", error: error.message });
  }
};

export const getTasaFinalizacion = async (_req: Request, res: Response) => {
  try {
    const data = await MetricasService.obtenerTasaFinalizacion();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error al calcular tasa de finalización", error: error.message });
  }
};

export const getPedidosDetallados = async (_req: Request, res: Response) => {
  try {
    const data = await MetricasService.obtenerPedidosDetallados();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener pedidos detallados", error: error.message });
  }
};

export const getPedidosClienteConstruccion = async (_req: Request, res: Response) => {
  try {
    const data = await MetricasService.obtenerPedidosClienteConstruccion();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener pedidos por cliente/construcción", error: error.message });
  }
};

export const getOrdenesProduccionDetalladas = async (_req: Request, res: Response) => {
  try {
    const data = await MetricasService.obtenerOrdenesProduccionDetalladas();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener órdenes de producción detalladas", error: error.message });
  }
};


export const getMermasPorTipoLadrillo = async (_req: Request, res: Response) => {
  try {
    const data = await MetricasService.obtenerMermasPorTipoLadrillo();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener tabla de mermas", error: error.message });
  }
};
