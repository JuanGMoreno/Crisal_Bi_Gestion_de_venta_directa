import { InventoryService } from '../services/inventory.service.js';

/**
 * Obtener el inventario completo
 */
export const getInventory = async (req, res) => {
  try {
    const inventory = await InventoryService.getInventory();
    if (inventory.length === 0) {
      res.status(404).json({ message: 'No se encontro el inventario' });
    } else {
      res.status(200).json(inventory);
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener el inventario', 
      error: error.message 
    });
  }
};

/**
 * Crear un inventario nuevo
 */
export const createInventory = async (req, res) => {
  try {
    const inventory = await InventoryService.createInventory(req.body);
    res.status(201).json(inventory);
  } catch (error) {
    res.status(400).json({ 
      message: error.message 
    });
  }
};

/**
 * Eliminar un inventario (soft delete)
 */
export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await InventoryService.deleteInventory(id);
    res.json(result);
  } catch (error) {
    const statusCode = error.message === 'Inventario no encontrado' ? 404 : 500;
    res.status(statusCode).json({ 
      message: error.message 
    });
  }
};
