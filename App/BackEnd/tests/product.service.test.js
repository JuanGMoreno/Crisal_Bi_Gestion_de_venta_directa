import { DistributorRepository } from '../src/repositories/distributor.repository.js';
import { ProductRepository } from '../src/repositories/product.repository.js';
import { ProductService } from '../src/services/product.service.js';
import { createMockRegistry } from './helpers/mock.js';

describe('ProductService', () => {
  let mocks;

  beforeEach(() => {
    mocks = createMockRegistry();
    mocks.replace(DistributorRepository, 'findByUserId', async () => ({
      id_distribuidor: 'distributor-1'
    }));
  });

  afterEach(() => {
    mocks.restoreAll();
  });

  test('lista solamente productos activos del distribuidor autenticado', async () => {
    let receivedFilters;

    mocks.replace(ProductRepository, 'findActiveByDistributor', async (distributorId) => {
      receivedFilters = distributorId;
      return [{ id_producto: 'product-1' }];
    });

    const products = await ProductService.getActiveProducts('user-1');

    expect(receivedFilters).toBe('distributor-1');
    expect(products).toHaveLength(1);
  });

  test('crea producto aislado por distribuidor sin exigir categoria', async () => {
    let createdPayload;

    mocks.replace(ProductRepository, 'findByCodeAndDistributor', async () => null);
    mocks.replace(ProductRepository, 'create', async (payload) => {
      createdPayload = payload;
      return { id_producto: 'product-1', ...payload };
    });

    const product = await ProductService.createProduct({
      nombre: 'Aceite esencial',
      codigo: 'A001',
      precio_base_venta: 10
    }, 'user-1');

    expect(createdPayload.id_distribuidor).toBe('distributor-1');
    expect(createdPayload).not.toHaveProperty('categoria');
    expect(product.nombre).toBe('Aceite esencial');
  });

  test('acepta y normaliza una categoria personalizada', async () => {
    let createdPayload;
    mocks.replace(ProductRepository, 'findByCodeAndDistributor', async () => null);
    mocks.replace(ProductRepository, 'create', async (payload) => {
      createdPayload = payload;
      return payload;
    });

    await ProductService.createProduct({
      nombre: 'Bolso artesanal',
      codigo: 'B001',
      precio_base_venta: 25,
      categoria: '  Accesorios artesanales  '
    }, 'user-1');

    expect(createdPayload.categoria).toBe('Accesorios artesanales');
  });

  test('permite limpiar la categoria al actualizar', async () => {
    let updatePayload;
    mocks.replace(ProductRepository, 'updateByDistributor', async (_id, _distributorId, payload) => {
      updatePayload = payload;
      return payload;
    });

    await ProductService.updateProduct('product-1', { categoria: '   ' }, 'user-1');

    expect(updatePayload.categoria).toBeNull();
  });

  test('rechaza crear un producto con codigo duplicado dentro del distribuidor', async () => {
    mocks.replace(ProductRepository, 'findByCodeAndDistributor', async () => ({
      id_producto: 'product-existing'
    }));

    await expect(ProductService.createProduct({
        nombre: 'Aceite esencial',
        codigo: 'A001',
        precio_base_venta: 10
      }, 'user-1')).rejects.toThrow(/Ya existe un producto con ese/);
  });

  test('traduce el conflicto de unicidad de la base de datos al crear', async () => {
    mocks.replace(ProductRepository, 'findByCodeAndDistributor', async () => null);
    mocks.replace(ProductRepository, 'create', async () => {
      const error = new Error(
        'llave duplicada viola restricción de unicidad «productos_codigo_key48»'
      );
      error.name = 'SequelizeUniqueConstraintError';
      error.original = {
        code: '23505',
        constraint: 'productos_codigo_key48'
      };
      throw error;
    });

    await expect(ProductService.createProduct({
      nombre: 'Aceite esencial',
      codigo: 'A001',
      precio_base_venta: 10
    }, 'user-1')).rejects.toThrow(
      'Ya existe un producto con ese código en tu negocio. Usa un código diferente.'
    );
  });

  test('actualiza producto aplicando aislamiento por distribuidor', async () => {
    let receivedArguments;

    mocks.replace(ProductRepository, 'findByCodeAndDistributor', async () => null);
    mocks.replace(ProductRepository, 'updateByDistributor', async (...args) => {
      receivedArguments = args;
      return { id_producto: 'product-1', nombre: 'Actualizado' };
    });

    await ProductService.updateProduct('product-1', {
      nombre: 'Actualizado'
    }, 'user-1');

    expect(receivedArguments[0]).toBe('product-1');
    expect(receivedArguments[1]).toBe('distributor-1');
    expect(receivedArguments[2].id_distribuidor).toBe('distributor-1');
  });

  test('elimina producto mediante soft delete limitado al distribuidor', async () => {
    mocks.replace(ProductRepository, 'softDeleteByDistributor', async (id, distributorId) => ({
      id_producto: id,
      id_distribuidor: distributorId,
      estado: 'Inactivo'
    }));

    const result = await ProductService.deleteProduct('product-1', 'user-1');

    expect(result.product.estado).toBe('Inactivo');
    expect(result.product.id_distribuidor).toBe('distributor-1');
  });
});
