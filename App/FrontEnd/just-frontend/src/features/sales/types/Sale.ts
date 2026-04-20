export interface SaleClient {
  id_cliente: string;
  nombre: string;
  cedula: string;
  direccion?: string | null;
  edad?: number | null;
  numero_telefono?: string | null;
  foto_avatar?: string | null;
  estado: string;
}

export interface SaleProduct {
  id_producto: string;
  nombre: string;
  codigo: string;
  precio_base_venta: number;
  categoria: string;
  estado: string;
}

export interface SaleDetailConsumption {
  id_consumo_detalle_venta: string;
  id_detalle_venta: string;
  id_detalle_ingreso: string;
  cantidad: number;
}

export interface SaleDetail {
  id_detalle_venta: string;
  id_producto: string;
  cantidad: number;
  precio_unitario: number;
  descuento_unitario: number;
  subtotal: number;
  estado: string;
  producto?: SaleProduct | null;
  consumos_stock?: SaleDetailConsumption[];
}

export interface Sale {
  id_venta: string;
  id_distribuidor: string;
  id_usuario?: string | null;
  id_cliente?: string | null;
  fecha_venta: string;
  total: number;
  estado: "Abierta" | "Cerrada" | "Anulada";
  cliente?: SaleClient | null;
  detalles: SaleDetail[];
}

