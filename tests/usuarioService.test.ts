import * as UsuarioModel from '../src/models/Usuario';
import bcrypt from 'bcrypt';
import { registrarUsuario } from '../src/services/usuarioService';

jest.mock('../src/models/Usuario');
jest.mock('bcrypt');

describe('usuarioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registrarUsuario debe hashear la contraseña y guardar el usuario', async () => {
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    (UsuarioModel.createUsuario as jest.Mock).mockResolvedValue(2);

    const res = await registrarUsuario('nom', 'email', 'pass', 3);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith('pass', 'salt');
    expect(UsuarioModel.createUsuario).toHaveBeenCalledWith('nom', 'email', 'hashed', 3);
    expect(res).toEqual({ id: 2, nombre: 'nom', email: 'email', rol: 3 });
  });
});

import { obtenerUsuarios, obtenerUsuarioById, editarUsuario, eliminarUsuario } from '../src/services/usuarioService';

describe('usuarioService additional functions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('obtenerUsuarios debe invocar getAllUsuarios', async () => {
    (UsuarioModel.getAllUsuarios as jest.Mock).mockResolvedValue([]);
    await obtenerUsuarios();
    expect(UsuarioModel.getAllUsuarios).toHaveBeenCalled();
  });

  it('obtenerUsuarioById debe invocar getUsuarioById', async () => {
    (UsuarioModel.getUsuarioById as jest.Mock).mockResolvedValue({id:1});
    const res = await obtenerUsuarioById(1);
    expect(UsuarioModel.getUsuarioById).toHaveBeenCalledWith(1);
    expect(res).toEqual({id:1});
  });

  it('editarUsuario debe invocar updateUsuario', async () => {
    await editarUsuario(1,'nom','email',2);
    expect(UsuarioModel.updateUsuario).toHaveBeenCalledWith(1,'nom','email',2);
  });

  it('eliminarUsuario debe invocar deleteUsuario', async () => {
    await eliminarUsuario(1);
    expect(UsuarioModel.deleteUsuario).toHaveBeenCalledWith(1);
  });
});
