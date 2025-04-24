import { Request, Response } from "express";
import * as ProductoService from "../services/productoService";

export const listarProductos = async (_req: Request, res: Response) => {
  try {
    const productos = await ProductoService.obtenerProductos();
    res.json(productos);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

export const crearProducto = async (req: Request, res: Response) => {
  try {
    const { id_producto, nombre_producto, tipo, cantidad_stock, precio_unitario } = req.body;
    const nuevo = await ProductoService.registrarProducto(id_producto, nombre_producto, tipo, cantidad_stock, precio_unitario);
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
    res.json({ message: "Producto actualizado correctamente", producto: update });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar producto", error: error.message });
  }
};

export const eliminarProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ProductoService.eliminarProducto(id);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar producto", error: error.message });
  }
};
