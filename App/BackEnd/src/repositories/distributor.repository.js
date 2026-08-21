import { Distributor, User } from '../models/index.js';

export const DistributorRepository = {
  findAll: async (filters = {}) => {
    return await Distributor.findAll({
      where: filters,
      order: [['createdAt', 'DESC']]
    });
  },

  findById: async (id) => {
    return await Distributor.findByPk(id);
  },

  findByUserId: async (userId) => {
    return await Distributor.findOne({ where: { id_usuario: userId } });
  },

  findProfileByUserId: async (userId) => {
    return await Distributor.findOne({
      where: { id_usuario: userId },
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id_usuario', 'correo', 'estado', 'createdAt', 'updatedAt']
      }]
    });
  },

  create: async (data, options = {}) => {
    return await Distributor.create(data, { transaction: options.transaction });
  },

  update: async (id, data, options = {}) => {
    const distributor = await Distributor.findByPk(id, { transaction: options.transaction });
    if (!distributor) return null;
    return await distributor.update(data, { transaction: options.transaction });
  },

  softDelete: async (id) => {
    const distributor = await Distributor.findByPk(id);
    if (!distributor) return null;
    return await distributor.update({ estado: 'Inactivo' });
  },

  delete: async (id) => {
    const distributor = await Distributor.findByPk(id);
    if (!distributor) return null;
    await distributor.destroy();
    return true;
  },

  countByStatus: async (estado) => {
    return await Distributor.count({ where: { estado } });
  }
};
