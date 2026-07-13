import { ClientRepository } from '../src/repositories/client.repository.js';
import { DistributorRepository } from '../src/repositories/distributor.repository.js';
import { ClientService } from '../src/services/client.service.js';
import { createMockRegistry } from './helpers/mock.js';

describe('ClientService', () => {
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

  test('lista solamente clientes activos del distribuidor autenticado', async () => {
    let receivedFilters;

    mocks.replace(ClientRepository, 'findAll', async (filters) => {
      receivedFilters = filters;
      return [{ id_cliente: 'client-1' }];
    });

    const clients = await ClientService.getClients('user-1');

    expect(receivedFilters).toEqual({
      estado: 'Activo',
      id_distribuidor: 'distributor-1'
    });
    expect(clients).toHaveLength(1);
  });

  test('crea cliente asignando el distribuidor autenticado', async () => {
    let createdPayload;

    mocks.replace(ClientRepository, 'findByDocumentAndDistributor', async () => null);
    mocks.replace(ClientRepository, 'create', async (payload) => {
      createdPayload = payload;
      return { id_cliente: 'client-1', ...payload };
    });

    const client = await ClientService.createClient({
      nombre: 'Cliente Uno',
      cedula: '123456',
      edad: '30'
    }, 'user-1');

    expect(createdPayload.id_distribuidor).toBe('distributor-1');
    expect(createdPayload.edad).toBe(30);
    expect(client.id_cliente).toBe('client-1');
  });

  test('permite la misma cedula en otro distribuidor', async () => {
    let receivedDistributorId;

    mocks.replace(ClientRepository, 'findByDocumentAndDistributor', async (_cedula, distributorId) => {
      receivedDistributorId = distributorId;
      return null;
    });
    mocks.replace(ClientRepository, 'create', async (payload) => payload);

    await ClientService.createClient({
      nombre: 'Cliente Compartido',
      cedula: '5555'
    }, 'user-1');

    expect(receivedDistributorId).toBe('distributor-1');
  });

  test('rechaza cedula duplicada dentro del mismo distribuidor', async () => {
    mocks.replace(ClientRepository, 'findByDocumentAndDistributor', async () => ({
      id_cliente: 'client-existing'
    }));

    await expect(ClientService.createClient({
      nombre: 'Cliente Duplicado',
      cedula: '5555'
    }, 'user-1')).rejects.toThrow(/Ya existe un cliente con esa cedula/);
  });

  test('obtiene, actualiza y elimina cliente solo dentro del distribuidor autenticado', async () => {
    const calls = [];

    mocks.replace(ClientRepository, 'findByIdAndDistributor', async (id, distributorId) => ({
      id_cliente: id,
      id_distribuidor: distributorId,
      nombre: 'Cliente Uno'
    }));
    mocks.replace(ClientRepository, 'findByDocumentAndDistributor', async () => null);
    mocks.replace(ClientRepository, 'updateByDistributor', async (id, distributorId, payload) => {
      calls.push(['update', id, distributorId, payload.id_distribuidor]);
      return { id_cliente: id, ...payload };
    });
    mocks.replace(ClientRepository, 'countSalesByClient', async (id, distributorId) => {
      calls.push(['count-sales', id, distributorId]);
      return 0;
    });
    mocks.replace(ClientRepository, 'softDeleteByDistributor', async (id, distributorId) => {
      calls.push(['delete', id, distributorId]);
      return { id_cliente: id, id_distribuidor: distributorId, estado: 'Inactivo' };
    });

    const client = await ClientService.getClientById('client-1', 'user-1');
    const updated = await ClientService.updateClient('client-1', {
      nombre: 'Cliente Actualizado',
      cedula: '123456'
    }, 'user-1');
    const deleted = await ClientService.deleteClient('client-1', 'user-1');

    expect(client.id_distribuidor).toBe('distributor-1');
    expect(updated.id_distribuidor).toBe('distributor-1');
    expect(deleted.client.estado).toBe('Inactivo');
    expect(calls).toEqual([
      ['update', 'client-1', 'distributor-1', 'distributor-1'],
      ['count-sales', 'client-1', 'distributor-1'],
      ['delete', 'client-1', 'distributor-1']
    ]);
  });
});
