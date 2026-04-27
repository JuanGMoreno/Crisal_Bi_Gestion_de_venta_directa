export interface DashboardPeriodSummary {
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
  averageTicket: number;
  units: number;
}

export interface DashboardComparisons {
  revenueChange: number;
  profitChange: number;
  ordersChange: number;
  averageTicketChange: number;
}

export interface DashboardTopProduct {
  id_producto: string;
  nombre: string;
  codigo: string;
  categoria: string;
  quantity: number;
  revenue: number;
  profit: number;
}

export interface DashboardSalesTrendItem {
  date: string;
  revenue: number;
  profit: number;
  orders: number;
}

export interface DashboardLowStockItem {
  id_producto: string;
  nombre: string;
  codigo: string;
  categoria: string;
  stock_total: number;
  lotes_activos: number;
  costo_promedio_compra: number;
  proximas_fechas_vencimiento: string[];
}

export interface DashboardRecentSale {
  id_venta: string;
  fecha_venta: string;
  total: number;
  estado: "Abierta" | "Cerrada" | "Anulada";
  cliente?: {
    id_cliente: string;
    nombre: string;
  } | null;
}

export interface DashboardSummary {
  generatedAt: string;
  currentMonth: DashboardPeriodSummary;
  previousMonth: DashboardPeriodSummary;
  comparisons: DashboardComparisons;
  today: DashboardPeriodSummary;
  salesStatus: {
    Abierta: number;
    Cerrada: number;
    Anulada: number;
  };
  topProducts: DashboardTopProduct[];
  salesTrend: DashboardSalesTrendItem[];
  inventory: {
    productsInStock: number;
    totalUnits: number;
    estimatedValue: number;
    lowStock: DashboardLowStockItem[];
  };
  recentSales: DashboardRecentSale[];
}
