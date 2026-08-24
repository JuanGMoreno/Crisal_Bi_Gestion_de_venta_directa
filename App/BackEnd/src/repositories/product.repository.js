import { Product } from '../models/index.js';

export const ProductRepository = {
  findActiveByDistributor: async (distributorId) => {
    return await Product.findAll({
      where: {
        estado: 'Activo',
        id_distribuidor: distributorId
      },
      order: [['createdAt', 'DESC']]
    });
  },

  findByIdAndDistributor: async (id, distributorId) => {
    return await Product.findOne({
      where: {
        id_producto: id,
        id_distribuidor: distributorId
      }
    });
  },

  findByCodeAndDistributor: async (codigo, distributorId) => {
    return await Product.findOne({
      where: {
        codigo,
        id_distribuidor: distributorId
      }
    });
  },

  findByIdsAndDistributor: async (ids, distributorId) => {
    return await Product.findAll({
      where: {
        id_producto: ids,
        id_distribuidor: distributorId
      }
    });
  },

  create: async (data) => {
    return await Product.create(data);
  },

  updateByDistributor: async (id, distributorId, data) => {
    const product = await ProductRepository.findByIdAndDistributor(id, distributorId);
    if (!product) return null;
    return await product.update(data);
  },

  softDeleteByDistributor: async (id, distributorId) => {
    const product = await ProductRepository.findByIdAndDistributor(id, distributorId);
    if (!product) return null;
    return await product.update({ estado: 'Inactivo' });
  }
};
