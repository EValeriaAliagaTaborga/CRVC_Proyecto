import { Request, Response } from "express";
import * as ProductoService from "../services/productoService";
import { registrarLog } from "../utils/logHelper";

export const listarProductos = async (_req: Request, res: Response) => {
  try {
    const productos = await ProductoService.obtenerProductos();
    res.json(productos);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

export const obtenerProductoEspecifico = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const producto = await ProductoService.obtenerProductoById(id);
    res.json(producto);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener producto", error: error.message });
  }
};

export const crearProducto = async (req: Request, res: Response) => {
  try {
    const { id_producto, nombre_producto, tipo, cantidad_stock, precio_unitario } = req.body;
    const nuevo = await ProductoService.registrarProducto(id_producto, nombre_producto, tipo, cantidad_stock, precio_unitario);

    const id_usuario_log = (req as any).usuario.id;
    await registrarLog(id_usuario_log, "Creación de Producto", `ID: ${id_producto} - Nombre: ${nombre_producto}`);

    res.status(201).json({ message: "Producto creado correctamente", producto: nuevo });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear producto", error: error.message });
  }
};

export const actualizarProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre_producto, tipo, cantidad_stock, precio_unitario } = req.body;
    const update = await ProductoService.editarProducto(id, nombre_producto, tipo, cantidad_stock, precio_unitario);

    const id_usuario_log = (req as any).usuario.id;
    await registrarLog(id_usuario_log, "Actualizacion de Producto", `ID: ${id} - Nombre: ${nombre_producto}`);

    res.status(201).json({ message: "Producto actualizado correctamente", producto: update });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar producto", error: error.message });
  }
};

export const eliminarProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ProductoService.eliminarProducto(id);

    const id_usuario_log = (req as any).usuario.id;
    await registrarLog(id_usuario_log, "Eliminacion de Producto", `ID: ${id}`);

    res.status(201).json({ message: "Producto eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar producto", error: error.message });
  }
};

export const listarMovimientosPorProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // id_producto
    const { tipo, desde, hasta } = req.query as { tipo?: "ENTRADA" | "SALIDA" | ""; desde?: string; hasta?: string; };
    const movimientos = await ProductoService.obtenerMovimientosProducto(id, {
      tipo: (tipo === "ENTRADA" || tipo === "SALIDA") ? tipo : "",
      desde, hasta,
    });
    res.json(movimientos);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener kardex", error: error.message });
  }
};

export const exportarMovimientosPorProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // id_producto
    const { tipo, desde, hasta, formato } = req.query as { tipo?: "ENTRADA"|"SALIDA"|""; desde?: string; hasta?: string; formato?: "pdf"|"xlsx"; };
    const filtros: { tipo?: "" | "ENTRADA" | "SALIDA"; desde?: string; hasta?: string } = { 
      tipo: (tipo === "ENTRADA" || tipo === "SALIDA") ? tipo : "", 
      desde, 
      hasta 
    };

    if (formato === "xlsx") {
      const buf = await ProductoService.exportarKardexExcel(id, filtros);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="kardex_${id}.xlsx"`);
      res.send(buf);
    }

    const buf = await ProductoService.exportarKardexPDF(id, filtros);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="kardex_${id}.pdf"`);
    res.send(buf);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error al exportar kardex", error: error.message });
  }
};

/** Consolidado (Todos los productos) */
export const exportarMovimientosConsolidado = async (req: Request, res: Response) => {
  try {
    const { tipo, desde, hasta, formato } = req.query as { tipo?: "ENTRADA"|"SALIDA"|""; desde?: string; hasta?: string; formato?: "pdf"|"xlsx"; };
    const filtros: { tipo?: "" | "ENTRADA" | "SALIDA"; desde?: string; hasta?: string } = { 
      tipo: (tipo === "ENTRADA" || tipo === "SALIDA") ? tipo as "" | "ENTRADA" | "SALIDA" : "", 
      desde, 
      hasta 
    };

    if (formato === "xlsx") {
      const buf = await ProductoService.exportarKardexExcelConsolidado(filtros);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="kardex_todos.xlsx"`);
      res.send(buf);
    }

    const buf = await ProductoService.exportarKardexPDFConsolidado(filtros);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="kardex_todos.pdf"`);
    res.send(buf);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error al exportar kardex (consolidado)", error: error.message });
  }
};
