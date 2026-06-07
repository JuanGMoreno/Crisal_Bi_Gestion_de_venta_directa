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

  findByIdAndDistributor: async (id, distributorId) => {
    return await Client.findOne({
      where: {
        id_cliente: id,
        id_distribuidor: distributorId
      }
    });
  },

  findByDocument: async (cedula) => {
    return await Client.findOne({
      where: { cedula }
    });
  },

  findByDocumentAndDistributor: async (cedula, distributorId) => {
    return await Client.findOne({
      where: {
        cedula,
        id_distribuidor: distributorId
      }
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

  updateByDistributor: async (id, distributorId, data) => {
    const client = await ClientRepository.findByIdAndDistributor(id, distributorId);
    if (!client) return null;
    return await client.update(data);
  },

  softDelete: async (id) => {
    const client = await Client.findByPk(id);
    if (!client) return null;
    return await client.update({ estado: 'Inactivo' });
  },

  softDeleteByDistributor: async (id, distributorId) => {
    const client = await ClientRepository.findByIdAndDistributor(id, distributorId);
    if (!client) return null;
    return await client.update({ estado: 'Inactivo' });
  },

  countSalesByClient: async (id, distributorId = null) => {
    const where = {
      id_cliente: id,
      ...(distributorId ? { id_distribuidor: distributorId } : {})
    };

    return await Sale.count({
      where
    });
  }
};
