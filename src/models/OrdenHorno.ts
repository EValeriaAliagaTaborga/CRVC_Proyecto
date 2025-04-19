export interface OrdenHorno {
  id_orden: number;
  id_producto: number;
  id_vagon: number;
  fecha_de_carga: string;
  fecha_de_descarga: string;
  cantidad_inicial_por_producir: string;
  cantidad_final_calidad_primera: string;
  cantidad_final_calidad_segunda: string;
  cantidad_final_calidad_tercera: string;
  estado: string;
}