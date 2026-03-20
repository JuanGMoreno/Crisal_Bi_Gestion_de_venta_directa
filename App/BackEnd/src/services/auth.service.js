import argon2 from "argon2";
import { UserRepository } from "../repositories/auth.repository.js";



/**
   * Registrar un nuevo usuario con email, password y rol (por defecto "user")
   */
export async function registerUser({ email, password }) {
  const existingUser = await UserRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("El usuario ya existe");
  }

  const passwordHash = await argon2.hash(password);

  const newUser = await UserRepository.create({
    correo: email,
    contrasena: passwordHash,
  });

  return {
    id: newUser.id_usuario,
    email: newUser.correo,
  };
}

//Validar las credenciales del usuarui en el login
export async function validateUserCredentials({ email, password }) {
  const user = await UserRepository.findByEmail(email);

  if (!user) {
    return null;
  }

  const passwordMatches = await argon2.verify(user.contrasena, password);

  if (!passwordMatches) {
    return null;
  }

  return {
    id: user.id_usuario,
    email: user.correo,
  };
}