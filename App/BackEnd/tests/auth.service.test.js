import argon2 from 'argon2';
import { sequelize } from '../src/config/database.js';
import { DistributorRepository } from '../src/repositories/distributor.repository.js';
import { UserRepository } from '../src/repositories/auth.repository.js';
import { registerUser, validateUserCredentials } from '../src/services/auth.service.js';
import { createMockRegistry } from './helpers/mock.js';

describe('AuthService', () => {
  let mocks;

  beforeEach(() => {
    mocks = createMockRegistry();
    mocks.replace(sequelize, 'transaction', async (callback) => callback({ id: 'transaction' }));
  });

  afterEach(() => {
    mocks.restoreAll();
  });

  test('registra usuario y distribuidor dentro de una transaccion', async () => {
    let createdUser;
    let createdDistributor;

    mocks.replace(UserRepository, 'findByEmail', async () => null);
    mocks.replace(UserRepository, 'create', async (payload) => {
      createdUser = payload;
      return {
        id_usuario: 'user-1',
        correo: payload.correo
      };
    });
    mocks.replace(DistributorRepository, 'findByCode', async () => null);
    mocks.replace(DistributorRepository, 'create', async (payload) => {
      createdDistributor = payload;
      return {
        id_distribuidor: 'distributor-1',
        ...payload,
        rol: 'Consultora'
      };
    });

    const result = await registerUser({
      email: '  TEST@correo.com ',
      password: 'secreto123',
      name: ' Ana Perez '
    });

    expect(createdUser.correo).toBe('test@correo.com');
    expect(await argon2.verify(createdUser.contrasena, 'secreto123')).toBe(true);
    expect(createdDistributor.id_usuario).toBe('user-1');
    expect(createdDistributor.codigo_referido).toMatch(/^ANAPEREZ-[A-Z0-9]{4}$/);
    expect(result.distributor.rol).toBe('Consultora');
  });

  test('rechaza registro cuando el correo ya existe', async () => {
    mocks.replace(UserRepository, 'findByEmail', async () => ({ id_usuario: 'existing-user' }));

    await expect(registerUser({
        email: 'existente@correo.com',
        password: 'secreto123',
        name: 'Ana'
      })).rejects.toMatchObject({
        message: 'El usuario ya existe',
        status: 409
      });
  });

  test('valida credenciales correctas', async () => {
    const passwordHash = await argon2.hash('secreto123');

    mocks.replace(UserRepository, 'findByEmail', async () => ({
      id_usuario: 'user-1',
      correo: 'ana@correo.com',
      contrasena: passwordHash
    }));

    const result = await validateUserCredentials({
      email: 'ana@correo.com',
      password: 'secreto123'
    });

    expect(result).toEqual({
      id: 'user-1',
      email: 'ana@correo.com'
    });
  });

  test('rechaza credenciales incorrectas sin revelar la causa', async () => {
    const passwordHash = await argon2.hash('secreto123');

    mocks.replace(UserRepository, 'findByEmail', async () => ({
      id_usuario: 'user-1',
      correo: 'ana@correo.com',
      contrasena: passwordHash
    }));

    const result = await validateUserCredentials({
      email: 'ana@correo.com',
      password: 'incorrecta'
    });

    expect(result).toBeNull();
  });
});
