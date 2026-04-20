import { InventoryService } from '../services/inventory.service.js';

export const getInventory = async (req, res) => {
  try {
    const summary = await InventoryService.getInventorySummary(req.user.id);

    if (summary.length === 0) {
      return res.status(404).json({ message: 'No se encontraron existencias de inventario' });
    }

    return res.status(200).json(summary);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener inventario',
      error: error.message
    });
  }
};

export const getInventoryEntries = async (req, res) => {
  try {
    const entries = await InventoryService.getInventoryEntries(req.user.id);

    if (entries.length === 0) {
      return res.status(404).json({ message: 'No se encontraron ingresos de inventario' });
    }

    return res.status(200).json(entries);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener ingresos de inventario',
      error: error.message
    });
  }
};

export const getInventoryEntry = async (req, res) => {
  try {
    const entry = await InventoryService.getInventoryEntryById(req.params.id, req.user.id);
    return res.status(200).json(entry);
  } catch (error) {
    const statusCode = error.message === 'Ingreso de inventario no encontrado' ? 404 : 400;
    return res.status(statusCode).json({ message: error.message });
  }
};

export const createInventory = async (req, res) => {
  try {
    const entry = await InventoryService.createInventoryEntry(req.body, req.user.id);
    return res.status(201).json(entry);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const result = await InventoryService.deleteInventoryEntry(req.params.id, req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message === 'Ingreso de inventario no encontrado' ? 404 : 400;
    return res.status(statusCode).json({ message: error.message });
  }
};
