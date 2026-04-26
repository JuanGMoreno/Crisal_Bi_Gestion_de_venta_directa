import { sequelize } from '../config/database.js';
import { ClientRepository } from '../repositories/client.repository.js';
import { InventoryRepository } from '../repositories/inventory.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { SaleRepository } from '../repositories/sale.repository.js';
import { resolveDistributorIdByUserId } from '../utils/distributor-context.js';

const ALLOWED_SALE_STATUSES = new Set(['Abierta', 'Cerrada', 'Anulada']);

function normalizeSaleStatus(value, fallback = 'Cerrada') {
  const status = value || fallback;

  if (!ALLOWED_SALE_STATUSES.has(status)) {
    throw new Error('Estado de venta invalido');
  }

  return status;
}

function normalizeSaleDate(value) {
  if (!value) return new Date();

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error('La fecha de venta no es valida');
  }

  return parsedDate;
}

function normalizeSaleDetails(details) {
  if (!Array.isArray(details) || details.length === 0) {
    throw new Error('La venta debe incluir al menos un detalle');
  }

  return details.map((detail, index) => {
    const cantidad = Number(detail.cantidad);
    const descuentoUnitario = Number(detail.descuento_unitario || 0);
    const precioUnitario =
      detail.precio_unitario === undefined || detail.precio_unitario === null || detail.precio_unitario === ''
        ? undefined
        : Number(detail.precio_unitario);

    if (!detail.id_producto) {
      throw new Error(`El detalle ${index + 1} requiere id_producto`);
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error(`La cantidad del detalle ${index + 1} debe ser un entero mayor que 0`);
    }

    if (Number.isNaN(descuentoUnitario) || descuentoUnitario < 0) {
      throw new Error(`El descuento del detalle ${index + 1} debe ser un numero mayor o igual a 0`);
    }

    if (precioUnitario !== undefined && (Number.isNaN(precioUnitario) || precioUnitario < 0)) {
      throw new Error(`El precio del detalle ${index + 1} debe ser un numero mayor o igual a 0`);
    }

    return {
      id_producto: detail.id_producto,
      cantidad,
      precio_unitario: precioUnitario,
      descuento_unitario: descuentoUnitario
    };
  });
}

async function validateRequiredClient(clientId) {
  if (!clientId) {
    throw new Error('Debes seleccionar un cliente');
  }

  const client = await ClientRepository.findById(clientId);

  if (!client || client.estado !== 'Activo') {
    throw new Error('Cliente no encontrado');
  }

  return client;
}

function buildDetailFromProduct(detail, product) {
  const price =
    detail.precio_unitario === undefined || detail.precio_unitario === null || detail.precio_unitario === ''
      ? Number(product.precio_base_venta)
      : Number(detail.precio_unitario);

  if (Number.isNaN(price) || price < 0) {
    throw new Error(`El precio del producto ${product.nombre} no es valido`);
  }

  const netPrice = Math.max(price - detail.descuento_unitario, 0);
  const subtotal = Number((detail.cantidad * netPrice).toFixed(2));

  return {
    id_producto: product.id_producto,
    cantidad: detail.cantidad,
    precio_unitario: price,
    descuento_unitario: detail.descuento_unitario,
    subtotal,
    estado: 'Activo'
  };
}

function sortStockDetailsForConsumption(details) {
  // FEFO: primero salen los lotes que vencen antes.
  // Si dos lotes vencen igual (o no vencen), usamos la fecha de ingreso
  // y luego createdAt para mantener una salida estable y predecible.
  return [...details].sort((a, b) => {
    const aExpiry = a.fecha_vencimiento ? new Date(a.fecha_vencimiento).getTime() : Number.POSITIVE_INFINITY;
    const bExpiry = b.fecha_vencimiento ? new Date(b.fecha_vencimiento).getTime() : Number.POSITIVE_INFINITY;

    if (aExpiry !== bExpiry) {
      return aExpiry - bExpiry;
    }

    const aEntryDate = a.ingreso?.fecha_ingreso ? new Date(a.ingreso.fecha_ingreso).getTime() : 0;
    const bEntryDate = b.ingreso?.fecha_ingreso ? new Date(b.ingreso.fecha_ingreso).getTime() : 0;

    if (aEntryDate !== bEntryDate) {
      return aEntryDate - bEntryDate;
    }

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

async function consumeStockForSaleDetails(distributorId, saleDetails, transaction) {
  // Reunimos todos los lotes consumibles de los productos involucrados
  // dentro de la misma transaccion para evitar lecturas inconsistentes.
  const productIds = [...new Set(saleDetails.map((detail) => detail.id_producto))];
  const stockDetails = await InventoryRepository.findConsumableStockDetailsByProducts(
    distributorId,
    productIds,
    { transaction }
  );

  const stockByProduct = new Map();

  for (const stockDetail of sortStockDetailsForConsumption(stockDetails)) {
    if (Number(stockDetail.cantidad_disponible) <= 0) continue;

    const bucket = stockByProduct.get(stockDetail.id_producto) || [];
    bucket.push(stockDetail);
    stockByProduct.set(stockDetail.id_producto, bucket);
  }

  const quantityUpdates = [];
  const consumptions = [];

  for (const saleDetail of saleDetails) {
    // Cada detalle de venta puede consumirse desde uno o varios lotes.
    // Guardamos ese reparto para poder restaurar el stock exacto al anular.
    let pendingQuantity = Number(saleDetail.cantidad);
    const candidateStock = stockByProduct.get(saleDetail.id_producto) || [];

    for (const stockDetail of candidateStock) {
      if (pendingQuantity <= 0) break;

      const available = Number(stockDetail.cantidad_disponible);
      if (available <= 0) continue;

      const consumedQuantity = Math.min(available, pendingQuantity);
      stockDetail.cantidad_disponible = available - consumedQuantity;
      pendingQuantity -= consumedQuantity;

      quantityUpdates.push({
        id_detalle_ingreso: stockDetail.id_detalle_ingreso,
        cantidad_disponible: stockDetail.cantidad_disponible
      });

      consumptions.push({
        id_detalle_venta: saleDetail.id_detalle_venta,
        id_detalle_ingreso: stockDetail.id_detalle_ingreso,
        cantidad: consumedQuantity
      });
    }

    if (pendingQuantity > 0) {
      throw new Error('Stock insuficiente para completar la venta');
    }
  }

  for (const update of quantityUpdates) {
    await InventoryRepository.updateAvailableQuantity(
      update.id_detalle_ingreso,
      update.cantidad_disponible,
      { transaction }
    );
  }

  if (consumptions.length > 0) {
    await SaleRepository.createDetailConsumptions(consumptions, { transaction });
  }
}

async function restoreStockFromSale(sale, transaction) {
  // La anulacion devuelve cantidades a los mismos lotes registrados
  // durante el consumo original de la venta.
  const consumptions = sale.detalles.flatMap((detail) => detail.consumos_stock || []);

  for (const consumption of consumptions) {
    await InventoryRepository.incrementAvailableQuantity(
      consumption.id_detalle_ingreso,
      Number(consumption.cantidad),
      { transaction }
    );
  }
}

export const SaleService = {
  getSales: async (userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    return await SaleRepository.findAllByDistributor(distributorId);
  },

  getSaleById: async (id, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const sale = await SaleRepository.findByIdAndDistributor(id, distributorId);

    if (!sale) {
      throw new Error('Venta no encontrada');
    }

    return sale;
  },

  createSale: async (data, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const normalizedDetails = normalizeSaleDetails(data.detalles);
    const clientId = data.id_cliente;

    await validateRequiredClient(clientId);

    const productIds = [...new Set(normalizedDetails.map((detail) => detail.id_producto))];
    const products = await ProductRepository.findByIdsAndDistributor(productIds, distributorId);

    if (products.length !== productIds.length) {
      throw new Error('Uno o mas productos no pertenecen al distribuidor autenticado');
    }

    const productsById = new Map(products.map((product) => [product.id_producto, product]));

    const details = normalizedDetails.map((detail) => {
      const product = productsById.get(detail.id_producto);

      if (!product || product.estado !== 'Activo') {
        throw new Error('No se puede vender un producto inactivo o inexistente');
      }

      return buildDetailFromProduct(detail, product);
    });

    const total = Number(
      details.reduce((sum, detail) => sum + Number(detail.subtotal), 0).toFixed(2)
    );

    const saleData = {
      id_distribuidor: distributorId,
      id_usuario: userId,
      id_cliente: clientId,
      fecha_venta: normalizeSaleDate(data.fecha_venta),
      total,
      estado: normalizeSaleStatus(data.estado, 'Cerrada')
    };

    return await sequelize.transaction(async (transaction) => {
      const createdSale = await SaleRepository.create(saleData, details, { transaction });

      if (createdSale.sale.estado === 'Cerrada') {
        // Una venta cerrada impacta stock inmediatamente.
        await consumeStockForSaleDetails(distributorId, createdSale.details, transaction);
      }

      return await SaleRepository.findByIdAndDistributor(
        createdSale.sale.id_venta,
        distributorId,
        { transaction }
      );
    });
  },

  updateSale: async (id, data, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const normalizedDetails = normalizeSaleDetails(data.detalles);
    const clientId = data.id_cliente;

    await validateRequiredClient(clientId);

    const productIds = [...new Set(normalizedDetails.map((detail) => detail.id_producto))];
    const products = await ProductRepository.findByIdsAndDistributor(productIds, distributorId);

    if (products.length !== productIds.length) {
      throw new Error('Uno o mas productos no pertenecen al distribuidor autenticado');
    }

    const productsById = new Map(products.map((product) => [product.id_producto, product]));

    const details = normalizedDetails.map((detail) => {
      const product = productsById.get(detail.id_producto);

      if (!product || product.estado !== 'Activo') {
        throw new Error('No se puede vender un producto inactivo o inexistente');
      }

      return buildDetailFromProduct(detail, product);
    });

    const total = Number(
      details.reduce((sum, detail) => sum + Number(detail.subtotal), 0).toFixed(2)
    );

    return await sequelize.transaction(async (transaction) => {
      const existingSale = await SaleRepository.findByIdAndDistributor(id, distributorId, {
        transaction
      });

      if (!existingSale) {
        throw new Error('Venta no encontrada');
      }

      if (existingSale.estado !== 'Abierta') {
        throw new Error('Solo se pueden editar ventas abiertas');
      }

      await SaleRepository.updateByDistributor(
        id,
        distributorId,
        {
          id_cliente: clientId,
          fecha_venta: normalizeSaleDate(data.fecha_venta),
          total
        },
        { transaction }
      );

      await SaleRepository.replaceSaleDetails(id, details, { transaction });

      return await SaleRepository.findByIdAndDistributor(id, distributorId, { transaction });
    });
  },

  updateSaleStatus: async (id, status, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const nextStatus = normalizeSaleStatus(status, 'Cerrada');

    return await sequelize.transaction(async (transaction) => {
      const sale = await SaleRepository.findByIdAndDistributor(id, distributorId, { transaction });

      if (!sale) {
        throw new Error('Venta no encontrada');
      }

      if (sale.estado === 'Anulada') {
        throw new Error('No se puede modificar una venta anulada');
      }

      if (sale.estado === nextStatus) {
        return sale;
      }

      if (sale.estado === 'Abierta' && nextStatus === 'Cerrada') {
        await consumeStockForSaleDetails(distributorId, sale.detalles, transaction);
      } else if (sale.estado === 'Cerrada' && nextStatus === 'Anulada') {
        // Solo restauramos cuando la venta ya habia afectado inventario.
        await restoreStockFromSale(sale, transaction);
      } else if (sale.estado === 'Abierta' && nextStatus === 'Anulada') {
        // No requiere restaurar stock porque no se consumio.
      } else {
        throw new Error('Transicion de estado de venta no permitida');
      }

      await SaleRepository.updateStatusByDistributor(id, distributorId, nextStatus, { transaction });
      return await SaleRepository.findByIdAndDistributor(id, distributorId, { transaction });
    });
  },

  cancelSale: async (id, userId) => {
    const sale = await SaleService.updateSaleStatus(id, 'Anulada', userId);
    return { message: 'Venta anulada correctamente', sale };
  }
};
