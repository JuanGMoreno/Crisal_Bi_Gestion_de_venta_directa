import { DistributorRepository } from '../src/repositories/distributor.repository.js';
import { DistributorService } from '../src/services/distributor.service.js';
import { createMockRegistry } from './helpers/mock.js';

function createProfile(overrides = {}) {
  return {
    id_distribuidor: 'business-1',
    id_usuario: 'user-1',
    nombre: 'Tienda Ana',
    foto_avatar: null,
    estado: 'Activo',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
    usuario: { correo: 'ana@correo.com', estado: 'Activo' },
    ...overrides
  };
}

describe('DistributorService business profile', () => {
  let mocks;

  beforeEach(() => {
    mocks = createMockRegistry();
  });

  afterEach(() => mocks.restoreAll());

  test('devuelve un perfil sin campos jerarquicos', async () => {
    mocks.replace(DistributorRepository, 'findProfileByUserId', async () => createProfile());

    const profile = await DistributorService.getCurrentDistributorProfile('user-1');

    expect(profile.nombre).toBe('Tienda Ana');
    expect(profile.usuario.correo).toBe('ana@correo.com');
    expect(profile).not.toHaveProperty('rol');
    expect(profile).not.toHaveProperty('padre');
    expect(profile).not.toHaveProperty('codigo_referido');
  });

  test('actualiza solamente nombre y foto del perfil autenticado', async () => {
    let updatePayload;
    mocks.replace(DistributorRepository, 'findProfileByUserId', async () => createProfile());
    mocks.replace(DistributorRepository, 'update', async (_id, payload) => {
      updatePayload = payload;
      return { dataValues: { ...payload, updatedAt: '2026-08-21T00:00:00.000Z' } };
    });

    const profile = await DistributorService.updateCurrentDistributorProfile('user-1', {
      nombre: '  Mi negocio  ',
      foto_avatar: ' https://example.com/foto.png ',
      estado: 'Inactivo',
      rol: 'Lider'
    });

    expect(updatePayload).toEqual({
      nombre: 'Mi negocio',
      foto_avatar: 'https://example.com/foto.png'
    });
    expect(profile.nombre).toBe('Mi negocio');
  });
});
