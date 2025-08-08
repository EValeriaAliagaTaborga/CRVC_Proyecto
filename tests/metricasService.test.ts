import * as MetricasModel from '../src/models/Metricas';
import * as service from '../src/services/metricasService';

jest.mock('../src/models/Metricas');

describe('metricasService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getProductosMasVendidos', async () => {
    (MetricasModel.obtenerProductosMasVendidos as jest.Mock).mockResolvedValue([1]);
    const res = await service.getProductosMasVendidos();
    expect(MetricasModel.obtenerProductosMasVendidos).toHaveBeenCalled();
    expect(res).toEqual([1]);
  });

  it('getIngresosMensuales', async () => {
    (MetricasModel.obtenerIngresosMensuales as jest.Mock).mockResolvedValue([2]);
    const res = await service.getIngresosMensuales();
    expect(MetricasModel.obtenerIngresosMensuales).toHaveBeenCalled();
    expect(res).toEqual([2]);
  });

  it('getPromedioDescuento', async () => {
    (MetricasModel.obtenerPromedioDescuento as jest.Mock).mockResolvedValue([3]);
    const res = await service.getPromedioDescuento();
    expect(MetricasModel.obtenerPromedioDescuento).toHaveBeenCalled();
    expect(res).toEqual([3]);
  });

  it('obtenerPerdidasPorOrden', async () => {
    (MetricasModel.getPerdidaPorOrden as jest.Mock).mockResolvedValue([4]);
    const res = await service.obtenerPerdidasPorOrden();
    expect(MetricasModel.getPerdidaPorOrden).toHaveBeenCalled();
    expect(res).toEqual([4]);
  });

  it('obtenerProduccionCalidadMensual', async () => {
    (MetricasModel.getProduccionPorCalidadMensual as jest.Mock).mockResolvedValue([5]);
    const res = await service.obtenerProduccionCalidadMensual();
    expect(MetricasModel.getProduccionPorCalidadMensual).toHaveBeenCalled();
    expect(res).toEqual([5]);
  });

  it('obtenerPromedioPerdidaMensual', async () => {
    (MetricasModel.getPromedioPerdidaPorMes as jest.Mock).mockResolvedValue([6]);
    const res = await service.obtenerPromedioPerdidaMensual();
    expect(MetricasModel.getPromedioPerdidaPorMes).toHaveBeenCalled();
    expect(res).toEqual([6]);
  });

  it('obtenerKPIs', async () => {
    (MetricasModel.getKPIs as jest.Mock).mockResolvedValue([7]);
    const res = await service.obtenerKPIs();
    expect(MetricasModel.getKPIs).toHaveBeenCalled();
    expect(res).toEqual([7]);
  });

  it('obtenerDistribucionPedidos', async () => {
    (MetricasModel.getDistribucionPedidosPorEstado as jest.Mock).mockResolvedValue([8]);
    const res = await service.obtenerDistribucionPedidos();
    expect(MetricasModel.getDistribucionPedidosPorEstado).toHaveBeenCalled();
    expect(res).toEqual([8]);
  });

  it('obtenerTasaFinalizacion', async () => {
    (MetricasModel.getTasaFinalizacionOrdenes as jest.Mock).mockResolvedValue([9]);
    const res = await service.obtenerTasaFinalizacion();
    expect(MetricasModel.getTasaFinalizacionOrdenes).toHaveBeenCalled();
    expect(res).toEqual([9]);
  });

  it('obtenerPedidosDetallados', async () => {
    (MetricasModel.getPedidosDetallados as jest.Mock).mockResolvedValue([10]);
    const res = await service.obtenerPedidosDetallados();
    expect(MetricasModel.getPedidosDetallados).toHaveBeenCalled();
    expect(res).toEqual([10]);
  });

  it('obtenerOrdenesDetalladas', async () => {
    (MetricasModel.getOrdenesProduccionDetalladas as jest.Mock).mockResolvedValue([11]);
    const res = await service.obtenerOrdenesDetalladas();
    expect(MetricasModel.getOrdenesProduccionDetalladas).toHaveBeenCalled();
    expect(res).toEqual([11]);
  });

  it('obtenerPedidosClienteConstruccion', async () => {
    (MetricasModel.getPedidosPorClienteConstruccion as jest.Mock).mockResolvedValue([12]);
    const res = await service.obtenerPedidosClienteConstruccion();
    expect(MetricasModel.getPedidosPorClienteConstruccion).toHaveBeenCalled();
    expect(res).toEqual([12]);
  });

  it('obtenerOrdenesProduccionDetalladas', async () => {
    (MetricasModel.getOrdenesProduccionDetalladas as jest.Mock).mockResolvedValue([13]);
    const res = await service.obtenerOrdenesProduccionDetalladas();
    expect(MetricasModel.getOrdenesProduccionDetalladas).toHaveBeenCalled();
    expect(res).toEqual([13]);
  });

  it('obtenerMermasPorTipoLadrillo', async () => {
    (MetricasModel.getMermasPorTipoLadrillo as jest.Mock).mockResolvedValue([14]);
    const res = await service.obtenerMermasPorTipoLadrillo();
    expect(MetricasModel.getMermasPorTipoLadrillo).toHaveBeenCalled();
    expect(res).toEqual([14]);
  });
});
