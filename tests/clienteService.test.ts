import * as ClienteModel from '../src/models/Cliente';
import { registrarCliente, obtenerClientes } from '../src/services/clienteService';

jest.mock('../src/models/Cliente');

describe('clienteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('obtenerClientes debe invocar getAllClientes', async () => {
    (ClienteModel.getAllClientes as jest.Mock).mockResolvedValue([]);
    await obtenerClientes();
    expect(ClienteModel.getAllClientes).toHaveBeenCalled();
  });

  it('registrarCliente debe crear y devolver los datos del cliente', async () => {
    (ClienteModel.createCliente as jest.Mock).mockResolvedValue(1);
    const resultado = await registrarCliente('Emp', 'Contacto', '123', '456', 'c@e.com');
    expect(ClienteModel.createCliente).toHaveBeenCalledWith('Emp', 'Contacto', '123', '456', 'c@e.com');
    expect(resultado).toEqual({
      id: 1,
      nombre_empresa: 'Emp',
      nombre_contacto: 'Contacto',
      telefono_fijo: '123',
      celular: '456',
      email: 'c@e.com'
    });
  });
});
