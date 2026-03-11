import { ProductRepository } from '../repositories/product.repository.js';

export const ProductService = {
  /**
   * Obtener todos los productos activos
   */
  getActiveProducts: async () => {
    const products = await ProductRepository.findAll({ estado: 'Activo' });
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
  getProductById: async (id) => {
    const product = await ProductRepository.findById(id);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    return product;
  },

  /**
   * Crear producto con validaciones de negocio
   */
  createProduct: async (data) => {
    // Validación de negocio: precio de venta debe ser mayor al de compra
    if (data.precio_venta && data.precio_compra) {
      if (parseFloat(data.precio_venta) < parseFloat(data.precio_compra)) {
        throw new Error('El precio de venta no puede ser menor al precio de compra');
      }
    }

    // Validar que el código no exista
    if (data.codigo) {
      const existingProduct = await ProductRepository.findByCode(data.codigo);
      if (existingProduct) {
        throw new Error('Ya existe un producto con ese código');
      }
    }

    return await ProductRepository.create(data);
  },

  /**
   * Actualizar producto con validaciones
   */
  updateProduct: async (id, data) => {
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
   * Eliminar producto (soft delete)
   */
  deleteProduct: async (id) => {
    const product = await ProductRepository.softDelete(id);
    
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