import * as ProductoModel from "../models/Producto";
import ExcelJS from "exceljs";
import puppeteer from "puppeteer";

export const obtenerProductos = async () => ProductoModel.getAllProductos();
export const obtenerProductoById = async (id: string) => ProductoModel.getProductoById(id);
export const registrarProducto = async (id_producto: string, nombre_producto: string, tipo: string, cantidad_stock: number, precio_unitario: number) => {
  const id = await ProductoModel.createProducto(id_producto, nombre_producto, tipo, cantidad_stock, precio_unitario);
  return { id, id_producto, nombre_producto, tipo, cantidad_stock, precio_unitario };
};
export const editarProducto = async (id_producto: string, nombre_producto: string, tipo: string, cantidad_stock: number, precio_unitario: number) =>
  ProductoModel.updateProducto(id_producto, nombre_producto, tipo, cantidad_stock, precio_unitario);
export const eliminarProducto = async (id_producto: string) => ProductoModel.deleteProducto(id_producto);

export const obtenerMovimientosProducto = async (
  id_producto: string,
  opts?: { tipo?: "ENTRADA" | "SALIDA" | ""; desde?: string; hasta?: string }
) => ProductoModel.getMovimientosInventarioByProducto(id_producto, opts);

export const obtenerMovimientosTodos = async (
  opts?: { tipo?: "ENTRADA" | "SALIDA" | ""; desde?: string; hasta?: string }
) => ProductoModel.getMovimientosInventarioAll(opts);

/** =========== Exportaciones Excel & PDF (Por Producto) =========== */
export const exportarKardexExcel = async (id_producto: string, filtros: { tipo?: "ENTRADA" | "SALIDA" | ""; desde?: string; hasta?: string }) => {
  const movimientos = await obtenerMovimientosProducto(id_producto, filtros);
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Kardex");

  ws.columns = [
    { header: "Fecha", key: "fecha", width: 20 },
    { header: "Producto", key: "id_producto", width: 20 },
    { header: "Tipo", key: "tipo_movimiento", width: 12 },
    { header: "Cantidad", key: "cantidad", width: 12 },
    { header: "Motivo", key: "motivo", width: 32 },
    { header: "Referencia", key: "referencia", width: 20 },
    { header: "Usuario", key: "id_usuario", width: 12 },
  ];

  (movimientos as any[]).forEach((m) => {
    ws.addRow({
      fecha: new Date(m.fecha).toISOString().replace('T', ' ').slice(0, 19),
      id_producto: m.id_producto,
      tipo_movimiento: m.tipo_movimiento,
      cantidad: m.cantidad,
      motivo: m.motivo || "",
      referencia: m.referencia || "",
      id_usuario: m.id_usuario ?? "",
    });
  });

  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
};

function htmlKardex({
  titulo,
  movimientos,
  subtitulo
}: {
  titulo: string;
  movimientos: any[];
  subtitulo?: string;
}) {
  const rows = movimientos.map(m => `
    <tr>
      <td>${new Date(m.fecha).toLocaleString()}</td>
      <td>${m.id_producto}</td>
      <td>${m.tipo_movimiento}</td>
      <td style="text-align:right">${m.cantidad}</td>
      <td>${m.motivo || "-"}</td>
      <td>${m.referencia || "-"}</td>
      <td>${m.id_usuario ?? "-"}</td>
    </tr>
  `).join("");

  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>${titulo}</title>
    <style>
      body { font-family: Arial, sans-serif; font-size: 12px; color:#111; }
      h1 { font-size: 18px; margin: 0; }
      .muted { color:#666; font-size: 11px; }
      table { width:100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border: 1px solid #ddd; padding: 6px; }
      thead { background:#f4f4f4; }
      .section { margin-top: 18px; }
      .subtotal { background:#fafafa; font-weight:bold; }
    </style>
  </head>
  <body>
    <h1>${titulo}</h1>
    <div class="muted">${subtitulo || ""}</div>
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Producto</th>
          <th>Tipo</th>
          <th style="text-align:right">Cantidad</th>
          <th>Motivo</th>
          <th>Referencia</th>
          <th>Usuario</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="7" style="text-align:center;padding:12px;">Sin movimientos</td></tr>`}
      </tbody>
    </table>
  </body>
  </html>
  `;
}

export const exportarKardexPDF = async (id_producto: string, filtros: { tipo?: "ENTRADA" | "SALIDA" | ""; desde?: string; hasta?: string }) => {
  const movimientos = await obtenerMovimientosProducto(id_producto, filtros);
  const subtitulo = [
    filtros.desde ? `Desde: ${filtros.desde}` : null,
    filtros.hasta ? `Hasta: ${filtros.hasta}` : null,
    filtros.tipo ? `Tipo: ${filtros.tipo}` : null,
  ].filter(Boolean).join(" | ");

  const html = htmlKardex({
    titulo: `Kardex — Producto ${id_producto}`,
    movimientos: movimientos as any[],
    subtitulo
  });

  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" }
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
};

/** =========== Exportaciones Consolidado (Todos los productos) =========== */

export const exportarKardexExcelConsolidado = async (filtros: { tipo?: "ENTRADA" | "SALIDA" | ""; desde?: string; hasta?: string }) => {
  const movimientos = await obtenerMovimientosTodos(filtros) as any[];

  // Agrupar por producto
  const byProd: Record<string, any[]> = {};
  for (const m of movimientos) {
    byProd[m.id_producto] = byProd[m.id_producto] || [];
    byProd[m.id_producto].push(m);
  }

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Kardex Consolidado");

  ws.columns = [
    { header: "Producto", key: "id_producto", width: 20 },
    { header: "Fecha", key: "fecha", width: 20 },
    { header: "Tipo", key: "tipo_movimiento", width: 12 },
    { header: "Cantidad", key: "cantidad", width: 12 },
    { header: "Motivo", key: "motivo", width: 32 },
    { header: "Referencia", key: "referencia", width: 20 },
    { header: "Usuario", key: "id_usuario", width: 12 },
  ];

  let globalEntradas = 0;
  let globalSalidas = 0;

  Object.entries(byProd).forEach(([id_producto, rows]) => {
    const header = ws.addRow({ id_producto: `Producto: ${id_producto}` });
    header.font = { bold: true };

    let entradas = 0, salidas = 0;

    for (const m of rows) {
      ws.addRow({
        id_producto,
        fecha: new Date(m.fecha).toISOString().replace('T', ' ').slice(0, 19),
        tipo_movimiento: m.tipo_movimiento,
        cantidad: m.cantidad,
        motivo: m.motivo || "",
        referencia: m.referencia || "",
        id_usuario: m.id_usuario ?? "",
      });

      if (m.tipo_movimiento === "ENTRADA") entradas += Number(m.cantidad) || 0;
      if (m.tipo_movimiento === "SALIDA")  salidas  += Number(m.cantidad) || 0;
    }

    globalEntradas += entradas;
    globalSalidas  += salidas;

    const neto = entradas - salidas;
    const sub = ws.addRow({
      id_producto: `Subtotal ${id_producto} — Entradas: ${entradas} | Salidas: ${salidas} | Neto: ${neto}`
    });
    sub.font = { bold: true };
    ws.addRow({});
  });

  const netoGlobal = globalEntradas - globalSalidas;
  const totalRow = ws.addRow({
    id_producto: `TOTAL GLOBAL — Entradas: ${globalEntradas} | Salidas: ${globalSalidas} | Neto: ${netoGlobal}`
  });
  totalRow.font = { bold: true };
  ws.addRow({});

  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
};

function htmlKardexConsolidado({
  movimientos,
  filtros
}: {
  movimientos: any[];
  filtros: { tipo?: string; desde?: string; hasta?: string };
}) {
  const byProd: Record<string, any[]> = {};
  for (const m of movimientos) {
    byProd[m.id_producto] = byProd[m.id_producto] || [];
    byProd[m.id_producto].push(m);
  }

  const subtitle = [
    filtros.desde ? `Desde: ${filtros.desde}` : null,
    filtros.hasta ? `Hasta: ${filtros.hasta}` : null,
    filtros.tipo ? `Tipo: ${filtros.tipo}` : null,
  ].filter(Boolean).join(" | ");

  let globalEntradas = 0;
  let globalSalidas = 0;

  const sections = Object.entries(byProd).map(([prod, rows]) => {
    let entradas = 0, salidas = 0;
    const trs = rows.map(m => {
      if (m.tipo_movimiento === "ENTRADA") entradas += Number(m.cantidad) || 0;
      if (m.tipo_movimiento === "SALIDA")  salidas  += Number(m.cantidad) || 0;
      return `
        <tr>
          <td>${new Date(m.fecha).toLocaleString()}</td>
          <td>${m.tipo_movimiento}</td>
          <td style="text-align:right">${m.cantidad}</td>
          <td>${m.motivo || "-"}</td>
          <td>${m.referencia || "-"}</td>
          <td>${m.id_usuario ?? "-"}</td>
        </tr>
      `;
    }).join("");
    const neto = entradas - salidas;

    globalEntradas += entradas;
    globalSalidas  += salidas;

    return `
      <div class="section">
        <h2>Producto: ${prod}</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th style="text-align:right">Cantidad</th>
              <th>Motivo</th>
              <th>Referencia</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            ${trs || `<tr><td colspan="6" style="text-align:center;padding:8px;">Sin movimientos</td></tr>`}
            <tr class="subtotal">
              <td colspan="6">Subtotal ${prod} — Entradas: ${entradas} | Salidas: ${salidas} | Neto: ${neto}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }).join("");

  const netoGlobal = globalEntradas - globalSalidas;

  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>Kardex — Consolidado</title>
    <style>
      body { font-family: Arial, sans-serif; font-size: 12px; color:#111; }
      h1 { font-size: 18px; margin: 0; }
      h2 { font-size: 14px; margin: 14px 0 6px; }
      .muted { color:#666; font-size: 11px; margin-bottom: 8px; }
      table { width:100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 6px; }
      thead { background:#f4f4f4; }
      .section { margin-top: 16px; page-break-inside: avoid; }
      .subtotal { background:#fafafa; font-weight:bold; }
      .grandtotal { margin-top: 18px; padding: 10px; background:#eef7ff; border:1px solid #cfe4ff; font-weight:bold; }
    </style>
  </head>
  <body>
    <h1>Kardex — Consolidado (Todos los productos)</h1>
    <div class="muted">${subtitle || "Sin filtros"}</div>

    ${sections || `<p>Sin movimientos para los filtros seleccionados.</p>`}

    <div class="grandtotal">
      TOTAL GLOBAL — Entradas: ${globalEntradas} | Salidas: ${globalSalidas} | Neto: ${netoGlobal}
    </div>
  </body>
  </html>
  `;
}

export const exportarKardexPDFConsolidado = async (filtros: { tipo?: "ENTRADA" | "SALIDA" | ""; desde?: string; hasta?: string }) => {
  const movimientos = await obtenerMovimientosTodos(filtros) as any[];
  const html = htmlKardexConsolidado({ movimientos, filtros });

  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" }
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
};
