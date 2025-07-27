import * as ConstruccionModel from '../src/models/Construccion';
import {
  obtenerConstrucciones,
  obteneConstruccionById,
  registrarConstruccion,
  editarConstruccion,
  eliminarConstruccion,
  buscarConstrucciones
} from '../src/services/construccionService';

jest.mock('../src/models/Construccion');

describe('construccionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('obtenerConstrucciones debe invocar getAllConstrucciones', async () => {
    (ConstruccionModel.getAllConstrucciones as jest.Mock).mockResolvedValue([]);
    await obtenerConstrucciones();
    expect(ConstruccionModel.getAllConstrucciones).toHaveBeenCalled();
  });

  it('obteneConstruccionById debe invocar getConstruccionById y devolver los datos', async () => {
    (ConstruccionModel.getConstruccionById as jest.Mock).mockResolvedValue({id:1});
    const res = await obteneConstruccionById(1);
    expect(ConstruccionModel.getConstruccionById).toHaveBeenCalledWith(1);
    expect(res).toEqual({id:1});
  });

  it('registrarConstruccion debe crear y devolver los datos', async () => {
    (ConstruccionModel.createConstruccion as jest.Mock).mockResolvedValue(5);
    const res = await registrarConstruccion(2,'dir','est','cont','cel');
    expect(ConstruccionModel.createConstruccion).toHaveBeenCalledWith(2,'dir','est','cont','cel');
    expect(res).toEqual({
      id_cliente:2,
      direccion:'dir',
      estado_obra:'est',
      nombre_contacto_obra:'cont',
      celular_contacto_obra:'cel'
    });
  });

  it('editarConstruccion debe invocar updateConstruccion', async () => {
    await editarConstruccion(3,'d','e','c','c2');
    expect(ConstruccionModel.updateConstruccion).toHaveBeenCalledWith(3,'d','e','c','c2');
  });

  it('eliminarConstruccion debe invocar deleteConstruccion', async () => {
    await eliminarConstruccion(4);
    expect(ConstruccionModel.deleteConstruccion).toHaveBeenCalledWith(4);
  });

  it('buscarConstrucciones debe invocar buscarConstrucciones con filtros', async () => {
    const filtros = {cliente:'c', direccion:'d', estado:'e'};
    (ConstruccionModel.buscarConstrucciones as jest.Mock).mockResolvedValue([]);
    await buscarConstrucciones(filtros);
    expect(ConstruccionModel.buscarConstrucciones).toHaveBeenCalledWith(filtros);
  });
});
