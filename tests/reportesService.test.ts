import * as ReporteModel from '../src/models/Reporte';
import { generarHTMLPedidos, generarHTMLProduccion } from '../src/utils/pdfTemplate';
import { generarReportePedidos, generarReporteProduccion } from '../src/services/reportesService';
import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';

jest.mock('../src/models/Reporte');
jest.mock('../src/utils/pdfTemplate');

jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      setContent: jest.fn(),
      pdf: jest.fn().mockResolvedValue(Buffer.from('pdf'))
    }),
    close: jest.fn()
  })
}));

class FakeSheet {
  addRow = jest.fn();
  getRow = jest.fn().mockReturnValue({ font: {} });
}

jest.mock('exceljs', () => {
  return {
    Workbook: jest.fn().mockImplementation(() => {
      const sheet = new FakeSheet();
      return {
        addWorksheet: jest.fn(() => sheet),
        worksheets: [sheet],
        xlsx: {
          writeBuffer: jest.fn().mockResolvedValue(Buffer.from('excel')),
          load: jest.fn()
        }
      };
    })
  };
});

describe('reportesService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('generarReportePedidos en excel', async () => {
    (ReporteModel.obtenerPedidosPorFechas as jest.Mock).mockResolvedValue([{ id_pedido:1, fecha_pedido:'2025-01-01', nombre_cliente:'c', estado_pedido:'e' }]);
    const res = await generarReportePedidos('a','b','xlsx');
    expect(ReporteModel.obtenerPedidosPorFechas).toHaveBeenCalledWith('a','b');
    expect(res.nombreArchivo).toBe('reporte_pedidos.xlsx');
    expect(res.buffer).toBeInstanceOf(Buffer);
  });

  it('generarReportePedidos en pdf', async () => {
    (ReporteModel.obtenerPedidosPorFechas as jest.Mock).mockResolvedValue([]);
    (generarHTMLPedidos as jest.Mock).mockReturnValue('<html>');
    const res = await generarReportePedidos('a','b','pdf');
    expect(generarHTMLPedidos).toHaveBeenCalled();
    expect(res.nombreArchivo).toBe('reporte_pedidos.pdf');
  });

  it('generarReporteProduccion en pdf', async () => {
    (ReporteModel.obtenerOrdenesProduccionPorFechas as jest.Mock).mockResolvedValue([{ nombre_producto:'tipo - prod', fecha_carga:'2025-01-01', fecha_descarga:'2025-01-02', estado_orden:'E' }]);
    (generarHTMLProduccion as jest.Mock).mockReturnValue('<html>');
    const res = await generarReporteProduccion('a','b','pdf');
    expect(ReporteModel.obtenerOrdenesProduccionPorFechas).toHaveBeenCalledWith('a','b');
    expect(generarHTMLProduccion).toHaveBeenCalled();
    expect(res.nombreArchivo).toBe('reporte_produccion.pdf');
  });

  it('generarReporteProduccion en excel', async () => {
    (ReporteModel.obtenerOrdenesProduccionPorFechas as jest.Mock).mockResolvedValue([{ nombre_producto:'tipo - prod', fecha_carga:'2025-01-01', fecha_descarga:'2025-01-02', estado_orden:'E', primera:1, segunda:2, tercera:3 }]);
    const res = await generarReporteProduccion('a','b','xlsx');
    expect(res.nombreArchivo).toBe('reporte_produccion.xlsx');
  });
});
