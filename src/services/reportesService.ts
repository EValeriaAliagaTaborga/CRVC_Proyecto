import ExcelJS from "exceljs";
import puppeteer from "puppeteer";
import {
  obtenerPedidosPorFechas,
  obtenerOrdenesProduccionPorFechas,
} from "../models/Reporte";
import {
  generarHTMLPedidos,
  generarHTMLProduccion,
} from "../utils/pdfTemplate";
import { format } from "date-fns";

const generarExcel = async (
  datos: any[],
  columnas: any[],
  nombreHoja: string
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(nombreHoja);
  worksheet.columns = columnas;
  datos.forEach((dato) => worksheet.addRow(dato));
  worksheet.getRow(1).font = { bold: true };
  worksheet.addRow([]);
  worksheet.addRow(["Total registros", datos.length]);

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
};

const generarPDFDesdeHTML = async (html: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return Buffer.from(pdf);
};

export const generarReportePedidos = async (
  fechaInicio: string,
  fechaFin: string,
  formato: "pdf" | "xlsx"
) => {
  const datos = await obtenerPedidosPorFechas(fechaInicio, fechaFin);

  // ✅ Formatear fechas a "dd/MM/yyyy"
  const datosFormateados = datos.map((orden) => ({
    ...orden,
    fecha_pedido:
      orden.fecha_pedido && !isNaN(new Date(orden.fecha_pedido).getTime())
        ? format(new Date(orden.fecha_pedido), "dd/MM/yyyy")
        : ""
  }));

  const columnasExcel = [
    { header: "ID Pedido", key: "id_pedido", width: 15 },
    { header: "Fecha Pedido", key: "fecha_pedido", width: 20 },
    { header: "Cliente", key: "nombre_cliente", width: 25 },
    { header: "Estado", key: "estado_pedido", width: 15 },
  ];

  const buffer =
    formato === "xlsx"
      ? await generarExcel(datosFormateados, columnasExcel, "Reporte de Pedidos")
      : await generarPDFDesdeHTML(
          generarHTMLPedidos(datosFormateados, fechaInicio, fechaFin)
        );

  return {
    buffer,
    nombreArchivo: `reporte_pedidos.${formato}`,
  };
};

export const generarReporteProduccion = async (
  fechaInicio: string,
  fechaFin: string,
  formato: "pdf" | "xlsx"
) => {
  const datos = await obtenerOrdenesProduccionPorFechas(fechaInicio, fechaFin);

  // ✅ Formatear fechas a "dd/MM/yyyy"
  const datosFormateados = datos.map((orden) => ({
    ...orden,
    fecha_carga:
      orden.fecha_carga && !isNaN(new Date(orden.fecha_carga).getTime())
        ? format(new Date(orden.fecha_carga), "dd/MM/yyyy")
        : "",
    fecha_descarga:
      orden.fecha_descarga && !isNaN(new Date(orden.fecha_descarga).getTime())
        ? format(new Date(orden.fecha_descarga), "dd/MM/yyyy")
        : "",
  }));

  const columnasExcel = [
    { header: "ID Orden", key: "id_orden", width: 15 },
    { header: "Producto", key: "nombre_producto", width: 25 },
    { header: "Fecha Carga", key: "fecha_carga", width: 20 },
    { header: "Fecha Descarga", key: "fecha_descarga", width: 20 },
    { header: "Estado", key: "estado_orden", width: 15 },
    { header: "Primera", key: "primera", width: 15 },
    { header: "Segunda", key: "segunda", width: 15 },
    { header: "Tercera", key: "tercera", width: 15 },
  ];

  const resumenPorTipo: {
    [tipo: string]: { primera: number; segunda: number; tercera: number };
  } = {};

  console.log("Datos de ejemplo:", datos[0]);

  datos.forEach((orden) => {
    const tipo = orden.nombre_producto.split(" - ")[0];
    if (!resumenPorTipo[tipo]) {
      resumenPorTipo[tipo] = { primera: 0, segunda: 0, tercera: 0 };
    }
    resumenPorTipo[tipo].primera += orden.primera || 0;
    resumenPorTipo[tipo].segunda += orden.segunda || 0;
    resumenPorTipo[tipo].tercera += orden.tercera || 0;
  });

  if (formato === "xlsx") {
    const buffer = await generarExcel(
      datosFormateados,
      columnasExcel,
      "Reporte de Producción"
    );

    // Agregar resumen al Excel
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];
    sheet.addRow([]);
    sheet.addRow(["Resumen por tipo de producto y calidad:"]);

    for (const tipo in resumenPorTipo) {
      sheet.addRow([`${tipo}:`]);
      sheet.addRow(["", "Primera", resumenPorTipo[tipo].primera]);
      sheet.addRow(["", "Segunda", resumenPorTipo[tipo].segunda]);
      sheet.addRow(["", "Tercera", resumenPorTipo[tipo].tercera]);
    }

    const finalBuffer = await workbook.xlsx.writeBuffer();
    return {
      buffer: Buffer.from(finalBuffer),
      nombreArchivo: `reporte_produccion.xlsx`,
    };
  } else {
    const html = generarHTMLProduccion(datosFormateados, fechaInicio, fechaFin);
    const buffer = await generarPDFDesdeHTML(html);
    return {
      buffer,
      nombreArchivo: `reporte_produccion.pdf`,
    };
  }
};
