import { InventoryService } from './inventory.service.js';
import { SaleRepository } from '../repositories/sale.repository.js';
import { resolveDistributorIdByUserId } from '../utils/distributor-context.js';

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function isWithinRange(dateValue, startDate, endDate) {
  const timestamp = new Date(dateValue).getTime();
  return timestamp >= startDate.getTime() && timestamp < endDate.getTime();
}

function roundMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

function calculateVariation(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function calculateSaleCost(sale) {
  return roundMoney(
    (sale.detalles || []).reduce((saleCost, detail) => {
      const detailCost = (detail.consumos_stock || []).reduce((sum, consumption) => {
        const unitCost = Number(consumption.detalle_ingreso?.costo_unitario_compra || 0);
        return sum + Number(consumption.cantidad || 0) * unitCost;
      }, 0);

      return saleCost + detailCost;
    }, 0)
  );
}

function summarizeSales(sales) {
  const revenue = roundMoney(sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0));
  const cost = roundMoney(sales.reduce((sum, sale) => sum + calculateSaleCost(sale), 0));
  const profit = roundMoney(revenue - cost);
  const averageTicket = sales.length === 0 ? 0 : roundMoney(revenue / sales.length);

  return {
    revenue,
    cost,
    profit,
    orders: sales.length,
    averageTicket,
    units: sales.reduce(
      (sum, sale) =>
        sum + (sale.detalles || []).reduce((detailSum, detail) => detailSum + Number(detail.cantidad || 0), 0),
      0
    )
  };
}

function buildTopProducts(sales) {
  const products = new Map();

  for (const sale of sales) {
    for (const detail of sale.detalles || []) {
      const product = detail.producto;
      if (!product) continue;

      const current = products.get(product.id_producto) || {
        id_producto: product.id_producto,
        nombre: product.nombre,
        codigo: product.codigo,
        categoria: product.categoria,
        quantity: 0,
        revenue: 0,
        profit: 0
      };

      const detailRevenue = Number(detail.subtotal || 0);
      const detailCost = (detail.consumos_stock || []).reduce((sum, consumption) => {
        const unitCost = Number(consumption.detalle_ingreso?.costo_unitario_compra || 0);
        return sum + Number(consumption.cantidad || 0) * unitCost;
      }, 0);

      current.quantity += Number(detail.cantidad || 0);
      current.revenue = roundMoney(current.revenue + detailRevenue);
      current.profit = roundMoney(current.profit + detailRevenue - detailCost);
      products.set(product.id_producto, current);
    }
  }

  return [...products.values()]
    .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
    .slice(0, 5);
}

function buildSalesTrend(sales, today) {
  const firstDay = addDays(startOfDay(today), -29);
  const days = Array.from({ length: 30 }, (_, index) => {
    const date = addDays(firstDay, index);
    const key = date.toISOString().slice(0, 10);

    return {
      date: key,
      revenue: 0,
      profit: 0,
      orders: 0
    };
  });

  const daysByKey = new Map(days.map((day) => [day.date, day]));

  for (const sale of sales) {
    const key = new Date(sale.fecha_venta).toISOString().slice(0, 10);
    const day = daysByKey.get(key);
    if (!day) continue;

    const revenue = Number(sale.total || 0);
    day.revenue = roundMoney(day.revenue + revenue);
    day.profit = roundMoney(day.profit + revenue - calculateSaleCost(sale));
    day.orders += 1;
  }

  return days;
}

function buildStatusSummary(sales) {
  return sales.reduce(
    (summary, sale) => {
      summary[sale.estado] = (summary[sale.estado] || 0) + 1;
      return summary;
    },
    { Abierta: 0, Cerrada: 0, Anulada: 0 }
  );
}

export const DashboardService = {
  getDashboardSummary: async (userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const sales = await SaleRepository.findAllByDistributor(distributorId);
    const today = new Date();
    const inventory = await InventoryService.getInventorySummary(userId, {
      notifyAlerts: true,
      referenceDate: today
    });

    const currentMonthStart = startOfMonth(today);
    const nextMonthStart = addMonths(currentMonthStart, 1);
    const previousMonthStart = addMonths(currentMonthStart, -1);
    const todayStart = startOfDay(today);
    const tomorrowStart = addDays(todayStart, 1);

    const closedSales = sales.filter((sale) => sale.estado === 'Cerrada');
    const currentMonthSales = closedSales.filter((sale) =>
      isWithinRange(sale.fecha_venta, currentMonthStart, nextMonthStart)
    );
    const previousMonthSales = closedSales.filter((sale) =>
      isWithinRange(sale.fecha_venta, previousMonthStart, currentMonthStart)
    );
    const todaySales = closedSales.filter((sale) =>
      isWithinRange(sale.fecha_venta, todayStart, tomorrowStart)
    );

    const currentMonth = summarizeSales(currentMonthSales);
    const previousMonth = summarizeSales(previousMonthSales);
    const todaySummary = summarizeSales(todaySales);
    const inventoryValue = roundMoney(
      inventory.reduce(
        (sum, item) => sum + Number(item.stock_total || 0) * Number(item.costo_promedio_compra || 0),
        0
      )
    );

    return {
      generatedAt: today.toISOString(),
      currentMonth,
      previousMonth,
      comparisons: {
        revenueChange: calculateVariation(currentMonth.revenue, previousMonth.revenue),
        profitChange: calculateVariation(currentMonth.profit, previousMonth.profit),
        ordersChange: calculateVariation(currentMonth.orders, previousMonth.orders),
        averageTicketChange: calculateVariation(currentMonth.averageTicket, previousMonth.averageTicket)
      },
      today: todaySummary,
      salesStatus: buildStatusSummary(sales),
      topProducts: buildTopProducts(currentMonthSales),
      salesTrend: buildSalesTrend(closedSales, today),
      inventory: {
        productsInStock: inventory.length,
        totalUnits: inventory.reduce((sum, item) => sum + Number(item.stock_total || 0), 0),
        estimatedValue: inventoryValue,
        lowStock: inventory
          .filter((item) => item.alertas?.stock_bajo?.activa)
          .sort((a, b) => Number(a.stock_total || 0) - Number(b.stock_total || 0))
          .slice(0, 5),
        expiringOrExpired: inventory
          .filter((item) => item.alertas?.vencimiento?.activa)
          .sort((a, b) => {
            const left = Number(a.alertas?.vencimiento?.dias_para_vencer ?? 9999);
            const right = Number(b.alertas?.vencimiento?.dias_para_vencer ?? 9999);
            return left - right;
          })
          .slice(0, 5)
      },
      recentSales: sales.slice(0, 5).map((sale) => ({
        id_venta: sale.id_venta,
        fecha_venta: sale.fecha_venta,
        total: Number(sale.total || 0),
        estado: sale.estado,
        cliente: sale.cliente
          ? {
              id_cliente: sale.cliente.id_cliente,
              nombre: sale.cliente.nombre
            }
          : null
      }))
    };
  }
};
