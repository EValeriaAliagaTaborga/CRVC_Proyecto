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
