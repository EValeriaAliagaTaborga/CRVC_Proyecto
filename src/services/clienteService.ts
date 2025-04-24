import * as ClienteModel from "../models/Cliente";

export const obtenerClientes = async () => {
  return await ClienteModel.getAllClientes();
};

export const obtenerClienteById = async (id: number) => {
  return await ClienteModel.getClienteById(id);
};

export const registrarCliente = async (nombre_empresa: string, nombre_contacto: string, telefono_fijo: string, celular: string, email: string) => {
  const id = await ClienteModel.createCliente(nombre_empresa, nombre_contacto, telefono_fijo, celular, email);
  return { id: Number(id), nombre_empresa, nombre_contacto, telefono_fijo, celular, email };
};

export const editarCliente = async (id: number, nombre_empresa: string, nombre_contacto: string, telefono_fijo: string, celular: string, email: string) => {
  await ClienteModel.updateCliente(id, nombre_empresa, nombre_contacto, telefono_fijo, celular, email);
};

export const eliminarCliente = async (id: number) => {
  await ClienteModel.deleteCliente(id);
};
