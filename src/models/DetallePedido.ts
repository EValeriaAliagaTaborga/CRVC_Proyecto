export interface DetallePedido {
    id_detalle_pedido: number;
    id_pedido: number;
    id_producto: number;
    cantidad_pedida: number;
    fecha_estimada_entrega: string;
    precio_total: number;
}