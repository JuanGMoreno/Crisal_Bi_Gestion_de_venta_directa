import { Inventory } from "../models/index.js";

export const InventoryRepository = {
  /**
   * Buscar todo el inventario con filtros opcionales
   */
  findAll: async (filters = {}) => {
    return await Inventory.findAll({ 
      where: filters,
      order: [['createdAt', 'DESC']]
    });
  },

  /**
   * Crear nuevo inventario
   */
  create: async (data, options = {}) => {
    const { transaction } = options;
    return await Inventory.create(data, { transaction });
  },

  /**
   * Eliminación lógica (soft delete)
   */
  softDelete: async (id) => {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;
    return await inventory.update({ estado: 'Inactivo' });
  },

  /**
   * Eliminación física (hard delete) - usar con precaución
   */
  delete: async (id) => {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;
    await inventory.destroy();
    return true;
  },
};
