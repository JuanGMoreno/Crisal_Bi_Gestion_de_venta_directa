import { InventoryService } from '../services/inventory.service.js';
import { createApiError, withStatus } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';

export const getInventory = asyncHandler(async (req, res) => {
  const summary = await InventoryService.getInventorySummary(req.user.id, { notifyAlerts: true });

  if (summary.length === 0) {
    throw createApiError('No se encontraron existencias de inventario', 404);
  }

  return res.status(200).json(summary);
});

export const getInventoryEntries = asyncHandler(async (req, res) => {
  const entries = await InventoryService.getInventoryEntries(req.user.id);

  if (entries.length === 0) {
    throw createApiError('No se encontraron ingresos de inventario', 404);
  }

  return res.status(200).json(entries);
});

export const getInventoryEntry = asyncHandler(async (req, res) => {
  try {
    const entry = await InventoryService.getInventoryEntryById(req.params.id, req.user.id);
    return res.status(200).json(entry);
  } catch (error) {
    throw withStatus(error, error.message === 'Ingreso de inventario no encontrado' ? 404 : 400);
  }
});

export const createInventory = asyncHandler(async (req, res) => {
  try {
    const entry = await InventoryService.createInventoryEntry(req.body, req.user.id);
    return res.status(201).json(entry);
  } catch (error) {
    throw withStatus(error, 400);
  }
});

export const updateInventory = asyncHandler(async (req, res) => {
  try {
    const entry = await InventoryService.updateInventoryEntry(req.params.id, req.body, req.user.id);
    return res.status(200).json(entry);
  } catch (error) {
    throw withStatus(error, error.message === 'Ingreso de inventario no encontrado' ? 404 : 400);
  }
});

export const deleteInventory = asyncHandler(async (req, res) => {
  try {
    const result = await InventoryService.deleteInventoryEntry(req.params.id, req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    throw withStatus(error, error.message === 'Ingreso de inventario no encontrado' ? 404 : 400);
  }
});
