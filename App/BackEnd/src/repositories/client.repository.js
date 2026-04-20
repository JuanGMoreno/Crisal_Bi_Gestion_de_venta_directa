import { Client, Sale } from '../models/index.js';

export const ClientRepository = {
  findAll: async (filters = {}) => {
    return await Client.findAll({
      where: filters,
      order: [['createdAt', 'DESC']]
    });
  },

  findById: async (id) => {
    return await Client.findByPk(id);
  },

  findByDocument: async (cedula) => {
    return await Client.findOne({
      where: { cedula }
    });
  },

  create: async (data) => {
    return await Client.create(data);
  },

  update: async (id, data) => {
    const client = await Client.findByPk(id);
    if (!client) return null;
    return await client.update(data);
  },

  softDelete: async (id) => {
    const client = await Client.findByPk(id);
    if (!client) return null;
    return await client.update({ estado: 'Inactivo' });
  },

  countSalesByClient: async (id) => {
    return await Sale.count({
      where: { id_cliente: id }
    });
  }
};
