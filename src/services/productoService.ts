import * as ProductoModel from "../models/Producto";

export const obtenerProductos = async () => {
  return await ProductoModel.getAllProductos();
};

export const obtenerProductoById = async (id: string) => {
  return await ProductoModel.getProductoById(id);
};

export const registrarProducto = async (id_producto: string, nombre_producto: string, tipo: string, cantidad_stock: number, precio_unitario: number) => {
  const id = await ProductoModel.createProducto(id_producto, nombre_producto, tipo, cantidad_stock, precio_unitario);
  return { id, id_producto, nombre_producto, tipo, cantidad_stock, precio_unitario };
};

export const editarProducto = async (
    id_producto: string,
    nombre_producto: string,
    tipo: string,
    cantidad_stock: number,
    precio_unitario: number
) => {
  await ProductoModel.updateProducto(id_producto, nombre_producto, tipo, cantidad_stock, precio_unitario);
};

export const eliminarProducto = async (id_producto: string) => {
  await ProductoModel.deleteProducto(id_producto);
};
