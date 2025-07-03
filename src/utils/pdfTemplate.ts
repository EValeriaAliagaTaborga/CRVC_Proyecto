// utils/pdfTemplate.ts

export const generarHTMLPedidos = (datos: any[], fechaInicio: string, fechaFin: string) => {
  const totalPedidos = datos.length;
  const estados = datos.reduce((acc: any, pedido: any) => {
    acc[pedido.estado_pedido] = (acc[pedido.estado_pedido] || 0) + 1;
    return acc;
  }, {});
  const resumen = Object.entries(estados).map(
    ([estado, cantidad]) => `<li>${estado}: ${cantidad}</li>`
  ).join("");

  const filas = datos.map((d) => `
    <tr>
      <td>${d.id_pedido}</td>
      <td>${d.fecha_pedido}</td>
      <td>${d.nombre_cliente}</td>
      <td>${d.estado_pedido}</td>
    </tr>
  `).join("");

  return `
    <html>
    <head>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; }
        ul { list-style: none; padding-left: 0; }
      </style>
    </head>
    <body>
      <h1>Reporte de Pedidos</h1>
      <p>Desde <strong>${fechaInicio}</strong> hasta <strong>${fechaFin}</strong></p>
      <table>
        <thead>
          <tr>
            <th>ID Pedido</th><th>Fecha</th><th>Cliente</th><th>Estado</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
      <h3>Resumen:</h3>
      <p>Total de pedidos: <strong>${totalPedidos}</strong></p>
      <ul>${resumen}</ul>
    </body>
    </html>
  `;
};

// utils/pdfTemplate.ts
export const generarHTMLProduccion = (datos: any[], fechaInicio: string, fechaFin: string) => {
  const totalOrdenes = datos.length;

  // Calcular totales por tipo y calidad
  const resumenPorTipo: { [tipo: string]: { primera: number; segunda: number; tercera: number } } = {};

  datos.forEach((orden) => {
    const tipo = orden.nombre_producto.split(" - ")[0];
    if (!resumenPorTipo[tipo]) {
      resumenPorTipo[tipo] = { primera: 0, segunda: 0, tercera: 0 };
    }
    resumenPorTipo[tipo].primera += orden.primera || 0;
    resumenPorTipo[tipo].segunda += orden.segunda || 0;
    resumenPorTipo[tipo].tercera += orden.tercera || 0;
  });

  const resumenHTML = Object.entries(resumenPorTipo)
    .map(([tipo, cantidades]) => `
      <h4>${tipo}:</h4>
      <ul>
        <li>Total Primera calidad: ${cantidades.primera}</li>
        <li>Total Segunda calidad: ${cantidades.segunda}</li>
        <li>Total Tercera calidad: ${cantidades.tercera}</li>
      </ul>
    `).join("");

  const filas = datos.map((d) => `
    <tr>
      <td>${d.id_orden}</td>
      <td>${d.nombre_producto}</td>
      <td>${d.fecha_carga}</td>
      <td>${d.fecha_descarga}</td>
      <td>${d.estado_orden}</td>
      <td>${d.primera}</td>
      <td>${d.segunda}</td>
      <td>${d.tercera}</td>
    </tr>
  `).join("");

  return `
    <html>
    <head>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; }
        ul { list-style: none; padding-left: 0; }
      </style>
    </head>
    <body>
      <h1>Reporte de Producción</h1>
      <p>Desde <strong>${fechaInicio}</strong> hasta <strong>${fechaFin}</strong></p>
      <table>
        <thead>
          <tr>
            <th>ID Orden</th><th>Producto</th><th>Fecha Carga</th><th>Fecha Descarga</th>
            <th>Estado</th><th>Primera</th><th>Segunda</th><th>Tercera</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>

      <h3>Resumen:</h3>
      <p>Total de órdenes: <strong>${totalOrdenes}</strong></p>
      ${resumenHTML}
    </body>
    </html>
  `;
};

