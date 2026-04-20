export interface InventoryProductOption {
  id_producto: string;
  nombre: string;
  codigo: string;
  categoria: string;
}

export interface InventoryEntryDetail {
  id_detalle_ingreso: string;
  id_producto: string;
  cantidad_inicial: number;
  cantidad_disponible: number;
  costo_unitario_compra: number;
  fecha_vencimiento?: string | null;
  numero_lote_fabricacion?: string | null;
  estado: string;
  producto?: InventoryProductOption;
}

export interface InventoryEntry {
  id_ingreso: string;
  id_distribuidor: string;
  fecha_ingreso: string;
  observacion?: string | null;
  estado: string;
  detalles: InventoryEntryDetail[];
}

export interface InventorySummaryItem {
  id_producto: string;
  nombre: string;
  codigo: string;
  categoria: string;
  stock_total: number;
  lotes_activos: number;
  costo_promedio_compra: number;
  proximas_fechas_vencimiento: string[];
}
