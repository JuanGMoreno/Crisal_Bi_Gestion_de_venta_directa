import { ProductRepository } from '../repositories/product.repository.js';
import { DistributorRepository } from '../repositories/distributor.repository.js';

async function resolveDistributorIdByUserId(userId) {
  const distributor = await DistributorRepository.findByUserId(userId);

  if (!distributor) {
    throw new Error('Distribuidor no encontrado para el usuario autenticado');
  }

  return distributor.id_distribuidor;
}

export const ProductService = {
  /**
   * Obtener todos los productos activos
   */
  getActiveProducts: async (userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const products = await ProductRepository.findAll({
      estado: 'Activo',
      id_distribuidor: distributorId
    });
    return products;
  },

  /**
   * Obtener todos los productos (activos e inactivos)
   */
  getAllProducts: async () => {
    return await ProductRepository.findAll();
  },

  /**
   * Obtener producto por ID con validaciones
   */
  getProductById: async (id, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const product = await ProductRepository.findByIdAndDistributor(id, distributorId);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    return product;
  },

  /**
   * Crear producto con validaciones de negocio
   */
  createProduct: async (data, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);

    // Validación de negocio: precio de venta debe ser mayor al de compra
    if (data.precio_venta && data.precio_compra) {
      if (parseFloat(data.precio_venta) < parseFloat(data.precio_compra)) {
        throw new Error('El precio de venta no puede ser menor al precio de compra');
      }
    }

    // Validar que el código no exista
    if (data.codigo) {
      const existingProduct = await ProductRepository.findByCodeAndDistributor(data.codigo, distributorId);
      if (existingProduct) {
        throw new Error('Ya existe un producto con ese código');
      }
    }

    return await ProductRepository.create({
      ...data,
      id_distribuidor: distributorId
    });
  },

  /**
   * Actualizar producto con validaciones
   */
  updateProduct: async (id, data, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);

    // Validación de negocio: precio de venta debe ser mayor al de compra
    if (data.precio_venta && data.precio_compra) {
      if (parseFloat(data.precio_venta) < parseFloat(data.precio_compra)) {
        throw new Error('El precio de venta no puede ser menor al precio de compra');
      }
    }

    // Si se está actualizando el código, validar que no exista
    if (data.codigo) {
      const existingProduct = await ProductRepository.findByCodeAndDistributor(data.codigo, distributorId);
      if (existingProduct && existingProduct.id_producto !== id) {
        throw new Error('Ya existe un producto con ese código');
      }
    }

    const product = await ProductRepository.updateByDistributor(id, distributorId, {
      ...data,
      id_distribuidor: distributorId
    });
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    return product;
  },

  /**
   * Eliminar producto (soft delete)
   */
  deleteProduct: async (id, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const product = await ProductRepository.softDeleteByDistributor(id, distributorId);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    return { message: 'Producto eliminado correctamente', product };
  },

  /**
   * Obtener estadísticas de productos
   */
  getProductStats: async () => {
    const activeCount = await ProductRepository.countByStatus('Activo');
    const inactiveCount = await ProductRepository.countByStatus('Inactivo');
    
    return {
      total: activeCount + inactiveCount,
      activos: activeCount,
      inactivos: inactiveCount
    };
  }
};