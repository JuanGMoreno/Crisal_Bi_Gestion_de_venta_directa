import { ProductRepository } from '../repositories/product.repository.js';
import { resolveDistributorIdByUserId } from '../utils/distributor-context.js';

const PRODUCT_CATEGORIES = [
  'Aromaterapia',
  'Bienestar emocional y mental',
  'Bienestar físico',
  'Bienestar dermo-comético'
];

function normalizeCategoryText(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const CATEGORY_BY_NORMALIZED_VALUE = PRODUCT_CATEGORIES.reduce((acc, category) => {
  acc[normalizeCategoryText(category)] = category;
  return acc;
}, {});

function validateBaseSalePrice(data) {
  if (data.precio_base_venta === undefined || data.precio_base_venta === null || data.precio_base_venta === '') {
    return;
  }

  const baseSalePrice = Number(data.precio_base_venta);
  if (Number.isNaN(baseSalePrice) || baseSalePrice < 0) {
    throw new Error('El precio base de venta debe ser un número mayor o igual a 0');
  }
}

function resolveCategoryOrThrow(category, { required = false } = {}) {
  if (category === undefined || category === null || category === '') {
    if (required) {
      return PRODUCT_CATEGORIES[0];
    }
    return undefined;
  }

  const normalizedInput = normalizeCategoryText(category);
  const resolvedCategory = CATEGORY_BY_NORMALIZED_VALUE[normalizedInput];

  if (!resolvedCategory) {
    throw new Error(`Categoría inválida. Valores permitidos: ${PRODUCT_CATEGORIES.join(', ')}`);
  }

  return resolvedCategory;
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
    validateBaseSalePrice(data);
    const categoria = resolveCategoryOrThrow(data.categoria, { required: true });

    // Validar que el código no exista
    if (data.codigo) {
      const existingProduct = await ProductRepository.findByCodeAndDistributor(data.codigo, distributorId);
      if (existingProduct) {
        throw new Error('Ya existe un producto con ese código');
      }
    }

    return await ProductRepository.create({
      ...data,
      categoria,
      id_distribuidor: distributorId
    });
  },

  /**
   * Actualizar producto con validaciones
   */
  updateProduct: async (id, data, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    validateBaseSalePrice(data);
    const categoria = resolveCategoryOrThrow(data.categoria);

    // Si se está actualizando el código, validar que no exista
    if (data.codigo) {
      const existingProduct = await ProductRepository.findByCodeAndDistributor(data.codigo, distributorId);
      if (existingProduct && existingProduct.id_producto !== id) {
        throw new Error('Ya existe un producto con ese código');
      }
    }

    const product = await ProductRepository.updateByDistributor(id, distributorId, {
      ...data,
      ...(categoria ? { categoria } : {}),
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
