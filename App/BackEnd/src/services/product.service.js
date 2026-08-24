import { ProductRepository } from '../repositories/product.repository.js';
import { resolveDistributorIdByUserId } from '../utils/distributor-context.js';

const MAX_CATEGORY_LENGTH = 80;
const DUPLICATE_PRODUCT_CODE_MESSAGE =
  'Ya existe un producto con ese código en tu negocio. Usa un código diferente.';

function isProductCodeUniqueConstraintError(error) {
  const isUniqueConstraintError =
    error?.name === 'SequelizeUniqueConstraintError' ||
    error?.original?.code === '23505' ||
    error?.parent?.code === '23505';

  if (!isUniqueConstraintError) return false;

  const constraintName = String(
    error?.original?.constraint || error?.parent?.constraint || ''
  ).toLowerCase();
  const fields = error?.fields || {};

  return (
    Object.prototype.hasOwnProperty.call(fields, 'codigo') ||
    constraintName.includes('codigo') ||
    String(error?.message || '').toLowerCase().includes('codigo')
  );
}

async function translateProductCodeConflict(operation) {
  try {
    return await operation();
  } catch (error) {
    if (isProductCodeUniqueConstraintError(error)) {
      throw new Error(DUPLICATE_PRODUCT_CODE_MESSAGE);
    }

    throw error;
  }
}

function validateBaseSalePrice(data) {
  if (data.precio_base_venta === undefined || data.precio_base_venta === null || data.precio_base_venta === '') {
    return;
  }

  const baseSalePrice = Number(data.precio_base_venta);
  if (Number.isNaN(baseSalePrice) || baseSalePrice < 0) {
    throw new Error('El precio base de venta debe ser un número mayor o igual a 0');
  }
}

function normalizeCategory(category) {
  if (category === undefined) return undefined;
  if (category === null || String(category).trim() === '') return null;

  const normalizedCategory = String(category).trim();
  if (normalizedCategory.length > MAX_CATEGORY_LENGTH) {
    throw new Error(`La categoría no puede superar ${MAX_CATEGORY_LENGTH} caracteres`);
  }

  return normalizedCategory;
}

export const ProductService = {
  getActiveProducts: async (userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    return await ProductRepository.findActiveByDistributor(distributorId);
  },

  getProductById: async (id, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const product = await ProductRepository.findByIdAndDistributor(id, distributorId);
    if (!product) throw new Error('Producto no encontrado');
    return product;
  },

  createProduct: async (data, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    validateBaseSalePrice(data);
    const categoria = normalizeCategory(data.categoria);

    if (data.codigo) {
      const existingProduct = await ProductRepository.findByCodeAndDistributor(data.codigo, distributorId);
      if (existingProduct) throw new Error(DUPLICATE_PRODUCT_CODE_MESSAGE);
    }

    return await translateProductCodeConflict(() =>
      ProductRepository.create({
        ...data,
        ...(categoria !== undefined ? { categoria } : {}),
        id_distribuidor: distributorId
      })
    );
  },

  updateProduct: async (id, data, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    validateBaseSalePrice(data);
    const categoria = normalizeCategory(data.categoria);

    if (data.codigo) {
      const existingProduct = await ProductRepository.findByCodeAndDistributor(data.codigo, distributorId);
      if (existingProduct && existingProduct.id_producto !== id) {
        throw new Error(DUPLICATE_PRODUCT_CODE_MESSAGE);
      }
    }

    const product = await translateProductCodeConflict(() =>
      ProductRepository.updateByDistributor(id, distributorId, {
        ...data,
        ...(categoria !== undefined ? { categoria } : {}),
        id_distribuidor: distributorId
      })
    );
    if (!product) throw new Error('Producto no encontrado');
    return product;
  },

  deleteProduct: async (id, userId) => {
    const distributorId = await resolveDistributorIdByUserId(userId);
    const product = await ProductRepository.softDeleteByDistributor(id, distributorId);
    if (!product) throw new Error('Producto no encontrado');
    return { message: 'Producto eliminado correctamente', product };
  }
};
