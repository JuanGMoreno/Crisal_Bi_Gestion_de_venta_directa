import { Client, Sale } from '../models/index.js';

export const ClientRepository = {
  findActiveByDistributor: async (distributorId) => {
    return await Client.findAll({
      where: {
        estado: 'Activo',
        id_distribuidor: distributorId
      },
      order: [['createdAt', 'DESC']]
    });
  },

  findByIdAndDistributor: async (id, distributorId) => {
    return await Client.findOne({
      where: {
        id_cliente: id,
        id_distribuidor: distributorId
      }
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

  updateByDistributor: async (id, distributorId, data) => {
    const client = await ClientRepository.findByIdAndDistributor(id, distributorId);
    if (!client) return null;
    return await client.update(data);
  },

  softDeleteByDistributor: async (id, distributorId) => {
    const client = await ClientRepository.findByIdAndDistributor(id, distributorId);
    if (!client) return null;
    return await client.update({ estado: 'Inactivo' });
  },

  countSalesByClient: async (id, distributorId) => {
    const where = {
      id_cliente: id,
      id_distribuidor: distributorId
    };

    return await Sale.count({
      where
    });
  }
};
