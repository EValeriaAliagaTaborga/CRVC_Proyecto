import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { checkRol } from "../middleware/rolMiddleware";
import {
  productosMasVendidos,
  ingresosPorMes,
  promedioDescuento,
  getPerdidasPorOrden,
  getProduccionCalidadMensual,
  getPromedioPerdidaMensual,
  getKPIs,
  getDistribucionPedidos,
  getTasaFinalizacion,
  getPedidosDetallados,
  getPedidosClienteConstruccion,
  getOrdenesProduccionDetalladas,
  getMermasPorTipoLadrillo
} from "../controllers/metricasController";

const router = Router();

router.get("/metricas/productos-mas-vendidos", verifyToken, checkRol("1"), productosMasVendidos);
router.get("/metricas/ingresos-mensuales", verifyToken, checkRol("1"), ingresosPorMes);
router.get("/metricas/promedio-descuento", verifyToken, checkRol("1"), promedioDescuento);
router.get("/metricas/produccion-perdida-por-orden", verifyToken, checkRol("1"), getPerdidasPorOrden);
router.get("/metricas/produccion-por-calidad-mensual", verifyToken, checkRol("1"), getProduccionCalidadMensual);
router.get("/metricas/produccion-promedio-perdida-mes", verifyToken, checkRol("1"), getPromedioPerdidaMensual);
router.get("/metricas/kpis", verifyToken, checkRol("1"), getKPIs);
router.get("/metricas/distribucion-pedidos", verifyToken, checkRol("1"), getDistribucionPedidos);
router.get("/metricas/tasa-finalizacion", verifyToken, checkRol("1"), getTasaFinalizacion);
router.get("/metricas/pedidos-detallados", verifyToken, checkRol("1"), getPedidosDetallados);
router.get("/metricas/pedidos-por-cliente-construccion", verifyToken, checkRol("1"), getPedidosClienteConstruccion);
router.get("/metricas/ordenes-produccion-detalladas", verifyToken, checkRol("1"), getOrdenesProduccionDetalladas);
router.get("/metricas/mermas-por-tipo", verifyToken, checkRol("1"), getMermasPorTipoLadrillo);



export default router;
