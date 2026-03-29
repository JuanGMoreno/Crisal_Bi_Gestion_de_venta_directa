import { DistributorRepository } from '../repositories/distributor.repository.js';

export const DistributorService = {
  /**
   * Obtener todos los distribuidores activos
   */
  getDistributors: async () => {
    const distributors = await DistributorRepository.findAll({ estado: 'Activo' });

    return distributors;
  },

  /**
   * Obtener todos los distribuidores (activos e inactivos)
   */
  getAllDistributors: async () => {
    return await DistributorRepository.findAll();
  },

  /**
   * Obtener distribuidor por ID con validaciones
   */
  getDistributorById: async (id) => {
    const distributor = await DistributorRepository.findById(id);
    
    if (!distributor) {
      throw new Error('Distribuidor no encontrado');
    }
    
    return distributor;
  },

  /**
   * Crear distribuidor con validaciones de negocio
   */
  createDistributor: async (data) => {
    // Validación de negocio: precio de venta debe ser mayor al de compra
    if (data.precio_venta && data.precio_compra) {
      if (parseFloat(data.precio_venta) < parseFloat(data.precio_compra)) {
        throw new Error('El precio de venta no puede ser menor al precio de compra');
      }
    }

    return await DistributorRepository.create(data);
  },

  /**
   * Actualizar distribuidor con validaciones
   */
  updateDistributor: async (id, data) => {
    // Validación de negocio: precio de venta debe ser mayor al de compra
    if (data.precio_venta && data.precio_compra) {
      if (parseFloat(data.precio_venta) < parseFloat(data.precio_compra)) {
        throw new Error('El precio de venta no puede ser menor al precio de compra');
      }
    }

    // Si se está actualizando el código, validar que no exista
    if (data.codigo) {
      const existingProduct = await ProductRepository.findByCode(data.codigo);
      if (existingProduct && existingProduct.id_producto !== id) {
        throw new Error('Ya existe un producto con ese código');
      }
    }

    const product = await ProductRepository.update(id, data);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    return product;
  },

  /**
   * Eliminar distribuidor (soft delete)
   */
  deleteDistributor: async (id) => {
    const distributor = await DistributorRepository.softDelete(id);
    
    if (!distributor) {
      throw new Error('Distribuidor no encontrado');
    }
    
    return { message: 'Distribuidor eliminado correctamente', distributor };
  },

};