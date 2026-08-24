import { Distributor, User } from '../models/index.js';

export const DistributorRepository = {
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
  }
};
