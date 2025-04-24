import * as ConstruccionModel from "../models/Construccion";

export const obtenerConstrucciones = async () => {
  return await ConstruccionModel.getAllConstrucciones();
};

export const obteneConstruccionById = async (id: number) => {
  return await ConstruccionModel.getConstruccionById(id);
};

export const registrarConstruccion = async (
  id_cliente: number,
  direccion: string,
  estado_obra: string,
  nombre_contacto_obra: string,
  celular_contacto_obra: string
) => {
  const id = await ConstruccionModel.createConstruccion(id_cliente, direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra);
  return { id_cliente, direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra };
};

export const editarConstruccion = async (
  id_construccion: number,
  direccion: string,
  estado_obra: string,
  nombre_contacto_obra: string,
  celular_contacto_obra: string
) => {
  await ConstruccionModel.updateConstruccion(id_construccion, direccion, estado_obra, nombre_contacto_obra, celular_contacto_obra);
};

export const eliminarConstruccion = async (id_construccion: number) => {
  await ConstruccionModel.deleteConstruccion(id_construccion);
};

interface FiltrosConstruccion {
    cliente?: string;
    direccion?: string;
    estado?: string;
  }
  
  export const buscarConstrucciones = async (filtros: FiltrosConstruccion) => {
    return await ConstruccionModel.buscarConstrucciones(filtros);
  };
  