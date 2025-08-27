import * as DemandaModel from "../models/DemandaProduccion";

export const acumularDemanda = async (args: {
  id_producto: string;
  nombre_producto: string;
  tipo: string;
  cantidad: number;
  fecha_objetivo?: string | null;
}) => DemandaModel.upsertDemanda(args);

export const obtenerDemandas = async () => DemandaModel.listDemandas();
