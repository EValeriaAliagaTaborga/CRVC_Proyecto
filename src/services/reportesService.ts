import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { obtenerPedidosPorFechas, obtenerOrdenesProduccionPorFechas } from "../models/Reporte";

const generarExcel = async (datos: any[], columnas: any[], nombreHoja: string): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(nombreHoja);
  worksheet.columns = columnas;
  datos.forEach((dato) => worksheet.addRow(dato));
  worksheet.getRow(1).font = { bold: true };
  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
};

const generarPDF = (datos: any[], columnas: string[], titulo: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const buffers: Uint8Array[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(16).text(titulo, { align: "center" }).moveDown();
    doc.fontSize(12);
    columnas.forEach((col) => doc.text(col, { continued: true, width: 100 }));
    doc.moveDown();
    datos.forEach((fila) => {
      columnas.forEach((col) => doc.text(fila[col]?.toString() || "", { continued: true, width: 100 }));
      doc.moveDown();
    });
    doc.end();
  });
};

export const generarReportePedidos = async (
  fechaInicio: string,
  fechaFin: string,
  formato: "pdf" | "xlsx"
) => {
  const datos = await obtenerPedidosPorFechas(fechaInicio, fechaFin);
  const columnasExcel = [
    { header: "ID Pedido", key: "id_pedido", width: 15 },
    { header: "Fecha Pedido", key: "fecha_pedido", width: 20 },
    { header: "Cliente", key: "nombre_cliente", width: 25 },
    { header: "Estado", key: "estado_pedido", width: 15 }
  ];
  const columnasPDF = ["id_pedido", "fecha_pedido", "nombre_cliente", "estado_pedido"];

  const buffer = formato === "xlsx"
    ? await generarExcel(datos, columnasExcel, "Reporte de Pedidos")
    : await generarPDF(datos, columnasPDF, "Reporte de Pedidos");

  return {
    buffer,
    nombreArchivo: `reporte_pedidos.${formato}`
  };
};

export const generarReporteProduccion = async (
  fechaInicio: string,
  fechaFin: string,
  formato: "pdf" | "xlsx"
) => {
  const datos = await obtenerOrdenesProduccionPorFechas(fechaInicio, fechaFin);
  const columnasExcel = [
    { header: "ID Orden", key: "id_orden", width: 15 },
    { header: "Producto", key: "nombre_producto", width: 25 },
    { header: "Fecha Carga", key: "fecha_carga", width: 20 },
    { header: "Fecha Descarga", key: "fecha_descarga", width: 20 },
    { header: "Estado", key: "estado_orden", width: 15 }
  ];
  const columnasPDF = ["id_orden", "nombre_producto", "fecha_carga", "fecha_descarga", "estado_orden"];

  const buffer = formato === "xlsx"
    ? await generarExcel(datos, columnasExcel, "Reporte de Producción")
    : await generarPDF(datos, columnasPDF, "Reporte de Producción");

  return {
    buffer,
    nombreArchivo: `reporte_produccion.${formato}`
  };
};
