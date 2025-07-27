import * as ProductoModel from '../src/models/Producto';
import {
  obtenerProductos,
  obtenerProductoById,
  registrarProducto,
  editarProducto,
  eliminarProducto
} from '../src/services/productoService';

jest.mock('../src/models/Producto');

describe('productoService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('obtenerProductos debe invocar getAllProductos', async () => {
    (ProductoModel.getAllProductos as jest.Mock).mockResolvedValue([]);
    await obtenerProductos();
    expect(ProductoModel.getAllProductos).toHaveBeenCalled();
  });

  it('obtenerProductoById debe invocar getProductoById', async () => {
    (ProductoModel.getProductoById as jest.Mock).mockResolvedValue({id: 'p'});
    const res = await obtenerProductoById('p');
    expect(ProductoModel.getProductoById).toHaveBeenCalledWith('p');
    expect(res).toEqual({id: 'p'});
  });

  it('registrarProducto debe crear y devolver datos', async () => {
    (ProductoModel.createProducto as jest.Mock).mockResolvedValue(1);
    const res = await registrarProducto('1','prod','tipo',5,10);
    expect(ProductoModel.createProducto).toHaveBeenCalledWith('1','prod','tipo',5,10);
    expect(res).toEqual({ id: 1, id_producto: '1', nombre_producto: 'prod', tipo: 'tipo', cantidad_stock: 5, precio_unitario: 10 });
  });

  it('editarProducto debe invocar updateProducto', async () => {
    await editarProducto('1','prod','t',5,10);
    expect(ProductoModel.updateProducto).toHaveBeenCalledWith('1','prod','t',5,10);
  });

  it('eliminarProducto debe invocar deleteProducto', async () => {
    await eliminarProducto('1');
    expect(ProductoModel.deleteProducto).toHaveBeenCalledWith('1');
  });
});
