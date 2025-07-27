import * as OrdenModel from '../src/models/OrdenHorno';
import {
  obtenerOrdenes,
  obtenerOrdenById,
  registrarOrden,
  finalizarOrden,
  eliminarOrden
} from '../src/services/ordenHornoService';

jest.mock('../src/models/OrdenHorno');

describe('ordenHornoService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('obtenerOrdenes debe invocar getAllOrdenes', async () => {
    (OrdenModel.getAllOrdenes as jest.Mock).mockResolvedValue([]);
    await obtenerOrdenes();
    expect(OrdenModel.getAllOrdenes).toHaveBeenCalled();
  });

  it('obtenerOrdenById debe invocar getOrdenById', async () => {
    (OrdenModel.getOrdenById as jest.Mock).mockResolvedValue({id:1});
    const res = await obtenerOrdenById(1);
    expect(OrdenModel.getOrdenById).toHaveBeenCalledWith(1);
    expect(res).toEqual({id:1});
  });

  it('registrarOrden debe crear la orden y devolver id', async () => {
    (OrdenModel.createOrden as jest.Mock).mockResolvedValue(2);
    const id = await registrarOrden('prod','vagon','fecha',10,'Nuevo');
    expect(OrdenModel.createOrden).toHaveBeenCalledWith('prod','vagon','fecha',10,'Nuevo');
    expect(id).toBe(2);
  });

  it('finalizarOrden debe invocar updateOrdenFinal', async () => {
    await finalizarOrden(1,'f',1,2,3,'Fin');
    expect(OrdenModel.updateOrdenFinal).toHaveBeenCalledWith(1,'f',1,2,3,'Fin');
  });

  it('eliminarOrden debe invocar deleteOrden', async () => {
    await eliminarOrden(3);
    expect(OrdenModel.deleteOrden).toHaveBeenCalledWith(3);
  });
});
