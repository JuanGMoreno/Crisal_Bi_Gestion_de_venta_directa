import { InventoryRepository } from "../repositories/inventory.repository";

export const InventoryService = {
  /**
   * Obtener todo el inventario
   */
  getInventory: async () => {
    const inventory = await InventoryRepository.findAll({ estado: 'Activo' });

    return inventory;
  },

  /**
   * Crear inventario con validaciones de negocio
   */
  createInventory: async (data) => {
    return await InventoryRepository.create(data);
  },
  
  /**
   * Eliminar inventario (soft delete)
   */
  deleteInventory: async (id) => {
    const inventory = await InventoryRepository.softDelete(id);
    
    if (!inventory) {
      throw new Error('Inventario no encontrado');
    }
    
    return { message: 'Inventario eliminado correctamente', inventory };
  },

};