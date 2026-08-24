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

  afterEach(() => mocks.restoreAll());

  test('registra usuario y negocio dentro de una transaccion', async () => {
    let createdUser;
    let createdDistributor;

    mocks.replace(UserRepository, 'findByEmail', async () => null);
    mocks.replace(UserRepository, 'create', async (payload) => {
      createdUser = payload;
      return { id_usuario: 'user-1', correo: payload.correo };
    });
    mocks.replace(DistributorRepository, 'create', async (payload) => {
      createdDistributor = payload;
      return { id_distribuidor: 'business-1', ...payload };
    });

    const result = await registerUser({
      email: '  TEST@correo.com ', password: 'secreto123', name: ' Ana Perez '
    });

    expect(createdUser.correo).toBe('test@correo.com');
    expect(await argon2.verify(createdUser.contrasena, 'secreto123')).toBe(true);
    expect(createdDistributor).toEqual({ nombre: 'Ana Perez', id_usuario: 'user-1' });
    expect(result.distributor).toEqual({ id: 'business-1', nombre: 'Ana Perez' });
  });

  test('rechaza registro cuando el correo ya existe', async () => {
    mocks.replace(UserRepository, 'findByEmail', async () => ({ id_usuario: 'existing-user' }));
    await expect(registerUser({
      email: 'existente@correo.com', password: 'secreto123', name: 'Ana'
    })).rejects.toMatchObject({ message: 'El usuario ya existe', status: 409 });
  });

  test('valida credenciales correctas', async () => {
    const passwordHash = await argon2.hash('secreto123');
    mocks.replace(UserRepository, 'findByEmail', async () => ({
      id_usuario: 'user-1', correo: 'ana@correo.com', contrasena: passwordHash
    }));
    await expect(validateUserCredentials({
      email: 'ana@correo.com', password: 'secreto123'
    })).resolves.toEqual({ id: 'user-1', email: 'ana@correo.com' });
  });

  test('rechaza credenciales incorrectas sin revelar la causa', async () => {
    const passwordHash = await argon2.hash('secreto123');
    mocks.replace(UserRepository, 'findByEmail', async () => ({
      id_usuario: 'user-1', correo: 'ana@correo.com', contrasena: passwordHash
    }));
    await expect(validateUserCredentials({
      email: 'ana@correo.com', password: 'incorrecta'
    })).resolves.toBeNull();
  });
});
