import * as MetricasModel from "../models/Metricas";

export const getProductosMasVendidos = async () => {
  return await MetricasModel.obtenerProductosMasVendidos();
};

export const getIngresosMensuales = async () => {
  return await MetricasModel.obtenerIngresosMensuales();
};

export const getPromedioDescuento = async () => {
  return await MetricasModel.obtenerPromedioDescuento();
};

export const obtenerPerdidasPorOrden = async () => {
  return await MetricasModel.getPerdidaPorOrden();
};

export const obtenerProduccionCalidadMensual = async () => {
  return await MetricasModel.getProduccionPorCalidadMensual();
};

export const obtenerPromedioPerdidaMensual = async () => {
  return await MetricasModel.getPromedioPerdidaPorMes();
};

export const obtenerKPIs = async () => {
  return await MetricasModel.getKPIs();
};

export const obtenerDistribucionPedidos = async () => {
  return await MetricasModel.getDistribucionPedidosPorEstado();
};

export const obtenerTasaFinalizacion = async () => {
  return await MetricasModel.getTasaFinalizacionOrdenes();
};

export const obtenerPedidosDetallados = async () => {
  return await MetricasModel.getPedidosDetallados();
};

export const obtenerOrdenesDetalladas = async () => {
  return await MetricasModel.getOrdenesProduccionDetalladas();
};

export const obtenerPedidosClienteConstruccion = async () => {
  return await MetricasModel.getPedidosPorClienteConstruccion();
};

export const obtenerOrdenesProduccionDetalladas = async () => {
  return await MetricasModel.getOrdenesProduccionDetalladas();
};


export const obtenerMermasPorTipoLadrillo = async () => {
  return await MetricasModel.getMermasPorTipoLadrillo();
};
