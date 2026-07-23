import { getClients } from '../src/controllers/client.controller.js';
import { getDistributors } from '../src/controllers/distributor.controller.js';
import { getInventory, getInventoryEntries } from '../src/controllers/inventory.controller.js';
import { getProducts } from '../src/controllers/product.controller.js';
import { getSales } from '../src/controllers/sale.controller.js';
import { ClientService } from '../src/services/client.service.js';
import { DistributorService } from '../src/services/distributor.service.js';
import { InventoryService } from '../src/services/inventory.service.js';
import { ProductService } from '../src/services/product.service.js';
import { SaleService } from '../src/services/sale.service.js';
import { createMockRegistry } from './helpers/mock.js';

function callController(controller, req = { user: { id: 'user-1' } }) {
  return new Promise((resolve, reject) => {
    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        resolve({
          status: this.statusCode,
          body: payload
        });
      }
    };

    controller(req, res, reject);
  });
}

describe('List controllers', () => {
  const mocks = createMockRegistry();

  afterEach(() => {
    mocks.restoreAll();
  });

  test.each([
    ['productos', ProductService, 'getActiveProducts', getProducts],
    ['clientes', ClientService, 'getClients', getClients],
    ['ventas', SaleService, 'getSales', getSales],
    ['resumen de inventario', InventoryService, 'getInventorySummary', getInventory],
    ['ingresos de inventario', InventoryService, 'getInventoryEntries', getInventoryEntries],
    ['distribuidores', DistributorService, 'getDistributors', getDistributors]
  ])('%s responde 200 con arreglo vacio cuando no hay registros', async (_name, service, method, controller) => {
    mocks.replace(service, method, async () => []);

    const response = await callController(controller);

    expect(response).toEqual({
      status: 200,
      body: []
    });
  });
});
