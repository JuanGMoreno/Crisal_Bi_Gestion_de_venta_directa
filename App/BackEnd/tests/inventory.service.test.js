import { sequelize } from '../src/config/database.js';
import { DistributorRepository } from '../src/repositories/distributor.repository.js';
import { InventoryRepository } from '../src/repositories/inventory.repository.js';
import { InventoryAlertDeliveryRepository } from '../src/repositories/inventory-alert-delivery.repository.js';
import { ProductRepository } from '../src/repositories/product.repository.js';
import { EmailService } from '../src/services/email.service.js';
import {
  buildInventoryAlertState,
  InventoryAlertService
} from '../src/services/inventory-alert.service.js';
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

  test('marca stock bajo cuando quedan 5 unidades o menos', () => {
    const referenceDate = new Date('2026-07-03T12:00:00.000Z');

    expect(buildInventoryAlertState({
      stockTotal: 5,
      expirationDates: [],
      referenceDate
    }).stock_bajo.activa).toBe(true);

    expect(buildInventoryAlertState({
      stockTotal: 6,
      expirationDates: [],
      referenceDate
    }).stock_bajo.activa).toBe(false);
  });

  test('marca vencimientos dentro de 30 dias y productos ya vencidos', () => {
    const referenceDate = new Date('2026-07-03T12:00:00.000Z');

    const expiring = buildInventoryAlertState({
      stockTotal: 10,
      expirationDates: ['2026-08-02T00:00:00.000Z'],
      referenceDate
    });
    const expired = buildInventoryAlertState({
      stockTotal: 10,
      expirationDates: ['2026-07-01T00:00:00.000Z'],
      referenceDate
    });
    const withoutExpiration = buildInventoryAlertState({
      stockTotal: 10,
      expirationDates: [],
      referenceDate
    });

    expect(expiring.vencimiento.activa).toBe(true);
    expect(expiring.vencimiento.estado).toBe('por_vencer');
    expect(expired.vencimiento.activa).toBe(true);
    expect(expired.vencimiento.estado).toBe('vencido');
    expect(withoutExpiration.vencimiento.activa).toBe(false);
  });

  test('el resumen solo alerta vencimientos de lotes disponibles', async () => {
    mocks.replace(InventoryRepository, 'findActiveStockDetailsByDistributor', async () => [
      {
        cantidad_disponible: 0,
        costo_unitario_compra: 3,
        fecha_vencimiento: new Date('2026-07-10T00:00:00.000Z'),
        producto: {
          id_producto: 'product-empty',
          nombre: 'Producto agotado',
          codigo: 'P0',
          categoria: 'Aromaterapia'
        }
      },
      {
        cantidad_disponible: 8,
        costo_unitario_compra: 3,
        fecha_vencimiento: new Date('2026-09-10T00:00:00.000Z'),
        producto: {
          id_producto: 'product-stock',
          nombre: 'Producto con stock',
          codigo: 'P1',
          categoria: 'Aromaterapia'
        }
      }
    ]);

    const summary = await InventoryService.getInventorySummary('user-1', {
      referenceDate: new Date('2026-07-03T12:00:00.000Z')
    });

    expect(summary).toHaveLength(1);
    expect(summary[0].id_producto).toBe('product-stock');
    expect(summary[0].alertas.vencimiento.activa).toBe(false);
  });

  test('envia cada alerta activa una sola vez por dia', async () => {
    const sentEmails = [];
    const createdDeliveries = [];
    const existingKeys = new Set();

    mocks.replace(EmailService, 'sendMail', async (payload) => {
      sentEmails.push(payload);
      return { messageId: `email-${sentEmails.length}` };
    });
    mocks.replace(InventoryAlertDeliveryRepository, 'findByDailyKey', async (key) => {
      const dailyKey = `${key.distributorId}:${key.productId}:${key.alertType}:${key.alertDate}`;
      return existingKeys.has(dailyKey) ? { id_alerta_inventario_envio: dailyKey } : null;
    });
    mocks.replace(InventoryAlertDeliveryRepository, 'create', async (payload) => {
      const dailyKey = [
        payload.id_distribuidor,
        payload.id_producto,
        payload.alert_type,
        payload.alert_date
      ].join(':');
      existingKeys.add(dailyKey);
      createdDeliveries.push(payload);
      return payload;
    });

    const item = {
      id_producto: 'product-1',
      nombre: 'Aceite esencial',
      codigo: 'A1',
      stock_total: 5,
      alertas: buildInventoryAlertState({
        stockTotal: 5,
        expirationDates: ['2026-07-15T00:00:00.000Z'],
        referenceDate: new Date('2026-07-03T12:00:00.000Z')
      })
    };

    await InventoryAlertService.notifyDailyAlerts({
      distributorId: 'distributor-1',
      recipientEmail: 'ana@correo.com',
      items: [item],
      referenceDate: new Date('2026-07-03T12:00:00.000Z')
    });
    await InventoryAlertService.notifyDailyAlerts({
      distributorId: 'distributor-1',
      recipientEmail: 'ana@correo.com',
      items: [item],
      referenceDate: new Date('2026-07-03T18:00:00.000Z')
    });
    await InventoryAlertService.notifyDailyAlerts({
      distributorId: 'distributor-1',
      recipientEmail: 'ana@correo.com',
      items: [item],
      referenceDate: new Date('2026-07-04T08:00:00.000Z')
    });

    expect(sentEmails).toHaveLength(2);
    expect(createdDeliveries).toHaveLength(4);
    expect(createdDeliveries.filter((delivery) => delivery.alert_date === '2026-07-03')).toHaveLength(2);
    expect(createdDeliveries.filter((delivery) => delivery.alert_date === '2026-07-04')).toHaveLength(2);
  });
});
