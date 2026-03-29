import { Distributor } from "../models/index.js";

export const DistributorRepository = {
  /**
   * Buscar todos los distribuidores con filtros opcionales
   */
  findAll: async (filters = {}) => {
    return await Distributor.findAll({ 
      where: filters,
      order: [['createdAt', 'DESC']]
    });
  },

  /**
   * Buscar distribuidor por ID
   */
  findById: async (id) => {
    return await Distributor.findByPk(id);
  },

  /**
   * Buscar distribuidor por código
   */
  findByCode: async (codigoReferido, options = {}) => {
    const { transaction } = options;
    return await Distributor.findOne({ 
      where: { codigo_referido: codigoReferido },
      transaction
    });
  },

  /**
   * Crear nuevo distribuidor
   */
  create: async (data, options = {}) => {
    const { transaction } = options;
    return await Distributor.create(data, { transaction });
  },

  /**
   * Actualizar distribuidor existente
   */
  update: async (id, data) => {
    const distributor = await Distributor.findByPk(id);
    if (!distributor) return null;
    return await distributor.update(data);
  },

  /**
   * Eliminación lógica (soft delete)
   */
  softDelete: async (id) => {
    const distributor = await Distributor.findByPk(id);
    if (!distributor) return null;
    return await distributor.update({ estado: 'Inactivo' });
  },

  /**
   * Eliminación física (hard delete) - usar con precaución
   */
  delete: async (id) => {
    const distributor = await Distributor.findByPk(id);
    if (!distributor) return null;
    await distributor.destroy();
    return true;
  },

  /**
   * Contar distribuidores por estado
   */
  countByStatus: async (estado) => {
    return await Distributor.count({ 
      where: { estado } 
    });
  }
};
