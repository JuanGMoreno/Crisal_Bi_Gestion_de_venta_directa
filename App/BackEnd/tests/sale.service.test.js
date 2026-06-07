import { sequelize } from '../src/config/database.js';
import { ClientRepository } from '../src/repositories/client.repository.js';
import { DistributorRepository } from '../src/repositories/distributor.repository.js';
import { InventoryRepository } from '../src/repositories/inventory.repository.js';
import { ProductRepository } from '../src/repositories/product.repository.js';
import { SaleRepository } from '../src/repositories/sale.repository.js';
import { SaleService } from '../src/services/sale.service.js';
import { createMockRegistry } from './helpers/mock.js';

describe('SaleService', () => {
  let mocks;

  beforeEach(() => {
    mocks = createMockRegistry();
    mocks.replace(sequelize, 'transaction', async (callback) => callback({ id: 'transaction' }));
    mocks.replace(DistributorRepository, 'findByUserId', async () => ({
      id_distribuidor: 'distributor-1'
    }));
    mocks.replace(ClientRepository, 'findByIdAndDistributor', async () => ({
      id_cliente: 'client-1',
      id_distribuidor: 'distributor-1',
      estado: 'Activo'
    }));
    mocks.replace(ProductRepository, 'findByIdsAndDistributor', async () => [{
      id_producto: 'product-1',
      nombre: 'Producto 1',
      precio_base_venta: 10,
      estado: 'Activo'
    }]);
  });

  afterEach(() => {
    mocks.restoreAll();
  });

  test('venta cerrada descuenta stock FEFO y registra consumo por lote', async () => {
    const quantityUpdates = [];
    let consumptions;
    const stockDetails = [
      {
        id_detalle_ingreso: 'stock-late',
        id_producto: 'product-1',
        cantidad_disponible: 10,
        fecha_vencimiento: '2026-12-30',
        createdAt: '2026-01-02'
      },
      {
        id_detalle_ingreso: 'stock-first',
        id_producto: 'product-1',
        cantidad_disponible: 2,
        fecha_vencimiento: '2026-06-30',
        createdAt: '2026-01-01'
      }
    ];

    mocks.replace(SaleRepository, 'create', async (saleData, details) => ({
      sale: { id_venta: 'sale-1', ...saleData },
      details: [{ id_detalle_venta: 'sale-detail-1', ...details[0] }]
    }));
    mocks.replace(InventoryRepository, 'findConsumableStockDetailsByProducts', async () => stockDetails);
    mocks.replace(InventoryRepository, 'updateAvailableQuantity', async (id, quantity) => {
      quantityUpdates.push({ id, quantity });
    });
    mocks.replace(SaleRepository, 'createDetailConsumptions', async (payload) => {
      consumptions = payload;
    });
    mocks.replace(SaleRepository, 'findByIdAndDistributor', async () => ({
      id_venta: 'sale-1',
      estado: 'Cerrada'
    }));

    const sale = await SaleService.createSale({
      id_cliente: 'client-1',
      estado: 'Cerrada',
      detalles: [{
        id_producto: 'product-1',
        cantidad: 5
      }]
    }, 'user-1');

    expect(sale.id_venta).toBe('sale-1');
    expect(quantityUpdates).toEqual([
      { id: 'stock-first', quantity: 0 },
      { id: 'stock-late', quantity: 7 }
    ]);
    expect(consumptions).toEqual([
      {
        id_detalle_venta: 'sale-detail-1',
        id_detalle_ingreso: 'stock-first',
        cantidad: 2
      },
      {
        id_detalle_venta: 'sale-detail-1',
        id_detalle_ingreso: 'stock-late',
        cantidad: 3
      }
    ]);
  });

  test('rechaza venta cerrada cuando el stock es insuficiente', async () => {
    mocks.replace(SaleRepository, 'create', async (saleData, details) => ({
      sale: { id_venta: 'sale-1', ...saleData },
      details: [{ id_detalle_venta: 'sale-detail-1', ...details[0] }]
    }));
    mocks.replace(InventoryRepository, 'findConsumableStockDetailsByProducts', async () => [{
      id_detalle_ingreso: 'stock-1',
      id_producto: 'product-1',
      cantidad_disponible: 2,
      createdAt: '2026-01-01'
    }]);

    await expect(SaleService.createSale({
        id_cliente: 'client-1',
        estado: 'Cerrada',
        detalles: [{
          id_producto: 'product-1',
          cantidad: 5
        }]
      }, 'user-1')).rejects.toThrow(/Stock insuficiente/);
  });

  test('rechaza crear venta con cliente ajeno al distribuidor autenticado', async () => {
    mocks.replace(ClientRepository, 'findByIdAndDistributor', async () => null);

    await expect(SaleService.createSale({
      id_cliente: 'foreign-client',
      estado: 'Cerrada',
      detalles: [{
        id_producto: 'product-1',
        cantidad: 1
      }]
    }, 'user-1')).rejects.toThrow(/Cliente no encontrado/);
  });

  test('anular venta cerrada restaura stock en los lotes consumidos', async () => {
    const increments = [];
    const statusChanges = [];
    let findCalls = 0;

    mocks.replace(SaleRepository, 'findByIdAndDistributor', async () => {
      findCalls += 1;

      if (findCalls === 1) {
        return {
          id_venta: 'sale-1',
          estado: 'Cerrada',
          detalles: [{
            consumos_stock: [
              { id_detalle_ingreso: 'stock-1', cantidad: 2 },
              { id_detalle_ingreso: 'stock-2', cantidad: 3 }
            ]
          }]
        };
      }

      return {
        id_venta: 'sale-1',
        estado: 'Anulada'
      };
    });
    mocks.replace(InventoryRepository, 'incrementAvailableQuantity', async (id, quantity) => {
      increments.push({ id, quantity });
    });
    mocks.replace(SaleRepository, 'updateStatusByDistributor', async (_id, _distributorId, status) => {
      statusChanges.push(status);
    });

    const result = await SaleService.cancelSale('sale-1', 'user-1');

    expect(increments).toEqual([
      { id: 'stock-1', quantity: 2 },
      { id: 'stock-2', quantity: 3 }
    ]);
    expect(statusChanges).toEqual(['Anulada']);
    expect(result.sale.estado).toBe('Anulada');
  });
});
