import { Product } from '../models/index.js';

export const ProductRepository = {
  /**
   * Buscar todos los productos con filtros opcionales
   */
  findAll: async (filters = {}) => {
    return await Product.findAll({ 
      where: filters,
      order: [['createdAt', 'DESC']]
    });
  },

  /**
   * Buscar producto por ID
   */
  findById: async (id) => {
    return await Product.findByPk(id);
  },

  /**
   * Buscar producto por código
   */
  findByCode: async (codigo) => {
    return await Product.findOne({ 
      where: { codigo } 
    });
  },

  /**
   * Crear nuevo producto
   */
  create: async (data) => {
    return await Product.create(data);
  },

  /**
   * Actualizar producto existente
   */
  update: async (id, data) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update(data);
  },

  /**
   * Eliminación lógica (soft delete)
   */
  softDelete: async (id) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update({ estado: 'Inactivo' });
  },

  /**
   * Eliminación física (hard delete) - usar con precaución
   */
  delete: async (id) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return true;
  },

  /**
   * Contar productos por estado
   */
  countByStatus: async (estado) => {
    return await Product.count({ 
      where: { estado } 
    });
  }
};
