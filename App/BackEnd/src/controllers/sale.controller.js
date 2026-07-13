import { SaleService } from '../services/sale.service.js';
import { createApiError, withStatus } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';

export const getSales = asyncHandler(async (req, res) => {
  const sales = await SaleService.getSales(req.user.id);

  if (sales.length === 0) {
    throw createApiError('No se encontraron ventas', 404);
  }

  return res.status(200).json(sales);
});

export const getSale = asyncHandler(async (req, res) => {
  try {
    const sale = await SaleService.getSaleById(req.params.id, req.user.id);
    return res.status(200).json(sale);
  } catch (error) {
    throw withStatus(error, error.message === 'Venta no encontrada' ? 404 : 400);
  }
});

export const createSale = asyncHandler(async (req, res) => {
  try {
    const sale = await SaleService.createSale(req.body, req.user.id);
    return res.status(201).json(sale);
  } catch (error) {
    throw withStatus(error, 400);
  }
});

export const updateSale = asyncHandler(async (req, res) => {
  try {
    const sale = await SaleService.updateSale(req.params.id, req.body, req.user.id);
    return res.status(200).json(sale);
  } catch (error) {
    throw withStatus(error, error.message === 'Venta no encontrada' ? 404 : 400);
  }
});

export const updateSaleStatus = asyncHandler(async (req, res) => {
  try {
    const sale = await SaleService.updateSaleStatus(req.params.id, req.body.estado, req.user.id);
    return res.status(200).json(sale);
  } catch (error) {
    throw withStatus(error, error.message === 'Venta no encontrada' ? 404 : 400);
  }
});

export const deleteSale = asyncHandler(async (req, res) => {
  try {
    const result = await SaleService.cancelSale(req.params.id, req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    throw withStatus(error, error.message === 'Venta no encontrada' ? 404 : 400);
  }
});
