import argon2 from 'argon2';
import { UserRepository } from '../repositories/auth.repository.js';
import { sequelize } from '../config/database.js';
import { DistributorRepository } from '../repositories/distributor.repository.js';

function createError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export async function registerUser({ email, password, name }) {
  return await sequelize.transaction(async (transaction) => {
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(name).trim();

    if (!normalizedName) {
      throw createError('El nombre es obligatorio', 400);
    }

    const existingUser = await UserRepository.findByEmail(normalizedEmail, { transaction });
    if (existingUser) {
      throw createError('El usuario ya existe', 409);
    }

    const passwordHash = await argon2.hash(password);
    const newUser = await UserRepository.create({
      correo: normalizedEmail,
      contrasena: passwordHash
    }, { transaction });

    const newDistributor = await DistributorRepository.create({
      nombre: normalizedName,
      id_usuario: newUser.id_usuario
    }, { transaction });

    return {
      id: newUser.id_usuario,
      email: newUser.correo,
      distributor: {
        id: newDistributor.id_distribuidor,
        nombre: newDistributor.nombre
      }
    };
  });
}

export async function validateUserCredentials({ email, password }) {
  const user = await UserRepository.findByEmail(email);
  if (!user) return null;

  const passwordMatches = await argon2.verify(user.contrasena, password);
  if (!passwordMatches) return null;

  return {
    id: user.id_usuario,
    email: user.correo
  };
}
