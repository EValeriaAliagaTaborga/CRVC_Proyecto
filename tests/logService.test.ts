import pool from '../src/config/db';
import { crearLog, obtenerLogsRecientes } from '../src/services/logService';

jest.mock('../src/config/db', () => ({
  __esModule: true,
  default: { query: jest.fn() }
}));

describe('logService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('crearLog debe insertar el log', async () => {
    await crearLog({ id_usuario: 1, accion: 'ACC', detalle: 'DET' });
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO logs (id_usuario, accion, detalle) VALUES (?, ?, ?)',
      [1, 'ACC', 'DET']
    );
  });

  it('obtenerLogsRecientes debe retornar filas', async () => {
    (pool.query as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const rows = await obtenerLogsRecientes();
    expect(pool.query).toHaveBeenCalled();
    expect(rows).toEqual([{ id: 1 }]);
  });
});
