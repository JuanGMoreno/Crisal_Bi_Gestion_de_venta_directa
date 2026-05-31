import { DistributorRepository } from '../src/repositories/distributor.repository.js';
import { DistributorService } from '../src/services/distributor.service.js';
import { createMockRegistry } from './helpers/mock.js';

function createProfile(overrides = {}) {
  return {
    id_distribuidor: 'child-1',
    id_usuario: 'user-1',
    id_distribuidor_padre: null,
    nombre: 'Ana',
    rol: 'Consultora',
    estado: 'Activo',
    usuario: {
      correo: 'ana@correo.com',
      estado: 'Activo'
    },
    padre: null,
    ...overrides
  };
}

describe('DistributorService hierarchy', () => {
  let mocks;

  beforeEach(() => {
    mocks = createMockRegistry();
  });

  afterEach(() => {
    mocks.restoreAll();
  });

  test('vincula consultora mediante codigo vigente de un lider', async () => {
    const child = createProfile();
    let updatePayload;

    mocks.replace(DistributorRepository, 'findProfileByUserId', async () => {
      if (updatePayload) {
        return createProfile({
          id_distribuidor_padre: 'leader-1',
          padre: {
            id_distribuidor: 'leader-1',
            nombre: 'Lider Principal',
            rol: 'Lider'
          }
        });
      }

      return child;
    });
    mocks.replace(DistributorRepository, 'findByCode', async () => ({
      id_distribuidor: 'leader-1',
      rol: 'Lider',
      estado: 'Activo',
      fecha_vencimiento_codigo: new Date(Date.now() + 60_000)
    }));
    mocks.replace(DistributorRepository, 'findById', async () => ({
      id_distribuidor: 'leader-1',
      id_distribuidor_padre: null,
      rol: 'Lider',
      estado: 'Activo'
    }));
    mocks.replace(DistributorRepository, 'countByParent', async () => 0);
    mocks.replace(DistributorRepository, 'findChildrenByParent', async () => []);
    mocks.replace(DistributorRepository, 'update', async (_id, payload) => {
      updatePayload = payload;
    });

    const profile = await DistributorService.linkCurrentDistributorByReferralCode(
      'user-1',
      ' leader-1a2b '
    );

    expect(updatePayload).toEqual({
      id_distribuidor_padre: 'leader-1'
    });
    expect(profile.padre.id_distribuidor).toBe('leader-1');
  });

  test('rechaza codigo de referido vencido', async () => {
    mocks.replace(DistributorRepository, 'findProfileByUserId', async () => createProfile());
    mocks.replace(DistributorRepository, 'findByCode', async () => ({
      id_distribuidor: 'leader-1',
      rol: 'Lider',
      estado: 'Activo',
      fecha_vencimiento_codigo: new Date(Date.now() - 60_000)
    }));

    await expect(
      DistributorService.linkCurrentDistributorByReferralCode('user-1', 'LEADER-1A2B')
    ).rejects.toThrow(/se encuentra vencido/);
  });

  test('rechaza asignar como padre a un descendiente', async () => {
    const distributors = new Map([
      ['leader-1', {
        id_distribuidor: 'leader-1',
        rol: 'Lider',
        estado: 'Activo',
        id_distribuidor_padre: null
      }],
      ['group-1', {
        id_distribuidor: 'group-1',
        rol: 'Lider de Grupo',
        estado: 'Activo',
        id_distribuidor_padre: 'leader-1'
      }],
      ['consultant-1', {
        id_distribuidor: 'consultant-1',
        rol: 'Consultora',
        estado: 'Activo',
        id_distribuidor_padre: 'group-1'
      }]
    ]);

    mocks.replace(DistributorRepository, 'findByCode', async () => null);
    mocks.replace(DistributorRepository, 'findById', async (id) => distributors.get(id));
    mocks.replace(DistributorRepository, 'countByParent', async () => 0);
    mocks.replace(DistributorRepository, 'findChildrenByParent', async () => []);

    await expect(DistributorService.updateDistributor('leader-1', {
        rol: 'Lider',
        id_distribuidor_padre: 'consultant-1'
      })).rejects.toThrow(/padre debe tener un rol superior|descendiente/);
  });

  test('impide bajar rol si deja hijos con rol igual o superior', async () => {
    mocks.replace(DistributorRepository, 'findByCode', async () => null);
    mocks.replace(DistributorRepository, 'findById', async () => ({
      id_distribuidor: 'leader-1',
      id_distribuidor_padre: null,
      rol: 'Lider',
      estado: 'Activo'
    }));
    mocks.replace(DistributorRepository, 'findChildrenByParent', async () => [{
      id_distribuidor: 'group-1',
      rol: 'Lider de Grupo',
      estado: 'Activo'
    }]);

    await expect(DistributorService.updateDistributor('leader-1', {
        rol: 'Lider de Grupo'
      })).rejects.toThrow(/rol igual o menor al rol de un distribuidor hijo/);
  });
});
