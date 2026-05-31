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

    mocks.replace(ProductRepository, 'findAll', async (filters) => {
      receivedFilters = filters;
      return [{ id_producto: 'product-1' }];
    });

    const products = await ProductService.getActiveProducts('user-1');

    expect(receivedFilters).toEqual({
      estado: 'Activo',
      id_distribuidor: 'distributor-1'
    });
    expect(products).toHaveLength(1);
  });

  test('crea producto aislado por distribuidor con categoria por defecto', async () => {
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
    expect(createdPayload.categoria).toBe('Aromaterapia');
    expect(product.nombre).toBe('Aceite esencial');
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
