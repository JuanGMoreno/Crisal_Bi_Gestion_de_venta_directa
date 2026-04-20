import { sequelize } from '../config/database.js';
import { InventoryRepository } from '../repositories/inventory.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { resolveDistributorIdByUserId } from '../utils/distributor-context.js';

function normalizeOptionalText(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return String(value).trim();
}

function normalizeEntryDate(value) {
  if (!value) return new Date();

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error('La fecha de ingreso no es valida');
  }

  return parsedDate;
}

function normalizeEntryDetails(details) {
  if (!Array.isArray(details) || details.length === 0) {
    throw new Error('El ingreso de inventario debe incluir al menos un detalle');
  }

  return details.map((detail, index) => {
    const cantidadInicial = Number(detail.cantidad_inicial);
    const costoCompra = Number(detail.costo_unitario_compra);
    const fechaVencimiento = detail.fecha_vencimiento ? new Date(detail.fecha_vencimiento) : null;

    if (!detail.id_producto) {
      throw new Error(`El detalle ${index + 1} requiere id_producto`);
    }

    if (!Number.isInteger(cantidadInicial) || cantidadInicial <= 0) {
      throw new Error(`La cantidad inicial del detalle ${index + 1} debe ser un entero mayor que 0`);
    }

    if (Number.isNaN(costoCompra) || costoCompra < 0) {
      throw new Error(`El costo unitario del detalle ${index + 1} debe ser un numero mayor o igual a 0`);
    }

    if (fechaVencimiento && Number.isNaN(fechaVencimiento.getTime())) {
      throw new Error(`La fecha de vencimiento del detalle ${index + 1} no es valida`);
    }

    return {
      id_producto: detail.id_producto,
      cantidad_inicial: cantidadInicial,
      cantidad_disponible: cantidadInicial,
      costo_unitario_compra: costoCompra,
      fecha_vencimiento: fechaVencimiento,
      numero_lote_fabricacion: normalizeOptionalText(detail.numero_lote_fabricacion),
      estado: 'Activo'
    };
  });
}

function buildStockSummary(details) {
  const stockMap = new Map();

  for (const detail of details) {
    const product = detail.producto;
    if (!product) continue;

    const current = stockMap.get(product.id_producto) || {
      id_producto: product.id_producto,
      nombre: product.nombre,
      codigo: product.codigo,
      categoria: product.categoria,
      stock_total: 0,
      lotes_activos: 0,
      costo_promedio_compra: 0,
      proximas_fechas_vencimiento: []
    };

    const cantidadDisponible = Number(detail.cantidad_disponible);
    const costoCompra = Number(detail.costo_unitario_compra);
    const accumulatedCost = current.costo_promedio_compra * current.stock_total;

    // Se consolida por producto para ofrecer al frontend un resumen util:
    // stock total, cantidad de lotes activos, costo promedio ponderado
    // y las proximas fechas de vencimiento relevantes.
    current.stock_total += cantidadDisponible;
    current.lotes_activos += 1;
    current.costo_promedio_compra =
      current.stock_total === 0
        ? 0
        : Number(((accumulatedCost + costoCompra * cantidadDisponible) / current.stock_total).toFixed(2));

    if (detail.fecha_vencimiento) {
      current.proximas_fechas_vencimiento.push(detail.fecha_vencimiento);
      current.proximas_fechas_vencimiento.sort((a, b) => new Date(a) - new Date(b));
      current.proximas_fechas_vencimiento = current.proximas_fechas_vencimiento.slice(0, 3);
    }

    stockMap.set(product.id_producto, current);
  }

  return [...stockMap.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export const InventoryService = {
  getInventoryEntries: async (userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    return await InventoryRepository.findEntriesByDistributor(distributorId);
  },

  getInventoryEntryById: async (id, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const entry = await InventoryRepository.findEntryByIdAndDistributor(id, distributorId);

    if (!entry) {
      throw new Error('Ingreso de inventario no encontrado');
    }

    return entry;
  },

  getInventorySummary: async (userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const details = await InventoryRepository.findActiveStockDetailsByDistributor(distributorId);
    return buildStockSummary(details.filter((detail) => Number(detail.cantidad_disponible) > 0));
  },

  createInventoryEntry: async (data, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const normalizedDetails = normalizeEntryDetails(data.detalles);
    const productIds = [...new Set(normalizedDetails.map((detail) => detail.id_producto))];
    const products = await ProductRepository.findByIdsAndDistributor(productIds, distributorId);

    if (products.length !== productIds.length) {
      throw new Error('Uno o mas productos no pertenecen al distribuidor autenticado');
    }

    const productsById = new Map(products.map((product) => [product.id_producto, product]));

    for (const detail of normalizedDetails) {
      const product = productsById.get(detail.id_producto);

      if (!product || product.estado !== 'Activo') {
        throw new Error('No se puede ingresar inventario para un producto inactivo o inexistente');
      }
    }

    const entryData = {
      id_distribuidor: distributorId,
      fecha_ingreso: normalizeEntryDate(data.fecha_ingreso),
      observacion: normalizeOptionalText(data.observacion),
      estado: 'Activo'
    };

    return await sequelize.transaction(async (transaction) => {
      // El ingreso y sus lotes deben nacer juntos o fallar juntos para
      // no dejar cabeceras sin detalles ni stock parcial.
      return await InventoryRepository.createEntry(entryData, normalizedDetails, { transaction });
    });
  },

  deleteInventoryEntry: async (id, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const entry = await InventoryRepository.findEntryByIdAndDistributor(id, distributorId);

    if (!entry) {
      throw new Error('Ingreso de inventario no encontrado');
    }

    const hasConsumedStock = entry.detalles?.some(
      (detail) =>
        Number(detail.cantidad_disponible) !== Number(detail.cantidad_inicial) ||
        (detail.consumos_venta?.length ?? 0) > 0
    );

    if (hasConsumedStock) {
      throw new Error('No se puede eliminar un ingreso de inventario que ya tuvo movimientos');
    }

    const deletedEntry = await InventoryRepository.softDeleteEntryByDistributor(id, distributorId);

    return { message: 'Ingreso de inventario eliminado correctamente', entry: deletedEntry };
  }
};
