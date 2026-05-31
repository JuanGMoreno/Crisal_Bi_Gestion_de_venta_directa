import { sequelize } from '../src/config/database.js';
import { DistributorRepository } from '../src/repositories/distributor.repository.js';
import { InventoryRepository } from '../src/repositories/inventory.repository.js';
import { ProductRepository } from '../src/repositories/product.repository.js';
import { InventoryService } from '../src/services/inventory.service.js';
import { createMockRegistry } from './helpers/mock.js';

describe('InventoryService', () => {
  let mocks;

  beforeEach(() => {
    mocks = createMockRegistry();
    mocks.replace(sequelize, 'transaction', async (callback) => callback({ id: 'transaction' }));
    mocks.replace(DistributorRepository, 'findByUserId', async () => ({
      id_distribuidor: 'distributor-1'
    }));
  });

  afterEach(() => {
    mocks.restoreAll();
  });

  test('lista entradas del distribuidor autenticado', async () => {
    let receivedDistributorId;

    mocks.replace(InventoryRepository, 'findEntriesByDistributor', async (distributorId) => {
      receivedDistributorId = distributorId;
      return [{ id_ingreso: 'entry-1' }];
    });

    const entries = await InventoryService.getInventoryEntries('user-1');

    expect(receivedDistributorId).toBe('distributor-1');
    expect(entries).toHaveLength(1);
  });

  test('crea entrada y detalles normalizados dentro de una transaccion', async () => {
    let receivedEntry;
    let receivedDetails;

    mocks.replace(ProductRepository, 'findByIdsAndDistributor', async () => [{
      id_producto: 'product-1',
      estado: 'Activo'
    }]);
    mocks.replace(InventoryRepository, 'createEntry', async (entry, details) => {
      receivedEntry = entry;
      receivedDetails = details;
      return { id_ingreso: 'entry-1', detalles: details };
    });

    const result = await InventoryService.createInventoryEntry({
      observacion: ' Primera entrada ',
      detalles: [{
        id_producto: 'product-1',
        cantidad_inicial: '5',
        costo_unitario_compra: '2.50',
        numero_lote_fabricacion: ' LOTE-1 '
      }]
    }, 'user-1');

    expect(receivedEntry.id_distribuidor).toBe('distributor-1');
    expect(receivedEntry.observacion).toBe('Primera entrada');
    expect(receivedDetails[0].cantidad_inicial).toBe(5);
    expect(receivedDetails[0].cantidad_disponible).toBe(5);
    expect(receivedDetails[0].costo_unitario_compra).toBe(2.5);
    expect(receivedDetails[0].numero_lote_fabricacion).toBe('LOTE-1');
    expect(result.id_ingreso).toBe('entry-1');
  });

  test('rechaza inventario con productos ajenos al distribuidor', async () => {
    mocks.replace(ProductRepository, 'findByIdsAndDistributor', async () => []);

    await expect(InventoryService.createInventoryEntry({
        detalles: [{
          id_producto: 'foreign-product',
          cantidad_inicial: 5,
          costo_unitario_compra: 2.5
        }]
      }, 'user-1')).rejects.toThrow(/no pertenecen al distribuidor autenticado/);
  });

  test('impide eliminar una entrada que ya tuvo movimientos', async () => {
    mocks.replace(InventoryRepository, 'findEntryByIdAndDistributor', async () => ({
      id_ingreso: 'entry-1',
      detalles: [{
        cantidad_inicial: 5,
        cantidad_disponible: 3,
        consumos_venta: []
      }]
    }));

    await expect(
      InventoryService.deleteInventoryEntry('entry-1', 'user-1')
    ).rejects.toThrow(/ya tuvo movimientos/);
  });
});
