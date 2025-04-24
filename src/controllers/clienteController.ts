// src/controllers/clienteController.ts
import { Request, Response } from "express";
import * as ClienteService from "../services/clienteService";

export const listarClientes = async (_req: Request, res: Response) => {
  try {
    const clientes = await ClienteService.obtenerClientes();
    res.json(clientes);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener clientes", error: error.message });
  }
};

export const obtenerClienteEspecifico = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cliente = await ClienteService.obtenerClienteById(Number(id));
    res.json(cliente);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener cliente", error: error.message });
  }
};

export const crearCliente = async (req: Request, res: Response) => {
  try {
    const { nombre_empresa, nombre_contacto, telefono_fijo, celular, email } = req.body;
    const nuevo = await ClienteService.registrarCliente(nombre_empresa, nombre_contacto, telefono_fijo, celular, email);
    res.status(201).json({ message: "Cliente registrado correctamente", cliente: nuevo });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear cliente", error: error.message });
  }
};

export const actualizarCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre_empresa, nombre_contacto, telefono_fijo, celular, email } = req.body;
    await ClienteService.editarCliente(Number(id), nombre_empresa, nombre_contacto, telefono_fijo, celular, email);
    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar cliente", error: error.message });
  }
};

export const eliminarCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ClienteService.eliminarCliente(Number(id));
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar cliente", error: error.message });
  }
};
