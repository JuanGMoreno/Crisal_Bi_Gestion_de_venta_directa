import argon2 from "argon2";
import { UserRepository } from "../repositories/auth.repository.js";
import { sequelize } from "../config/database.js";
import { DistributorRepository } from "../repositories/distributor.repository.js";
//intentos para crear codigo de referido unico y validez del codigo en dias
const CODE_VALIDITY_DAYS = 3;
const REFERRAL_CODE_ATTEMPTS = 5;

function createError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function normalizeName(name) {
  return String(name).trim();
}
//Genera el prefijo del codigo "JUANG"
function buildReferralPrefix(name) {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (normalized || "CONSULTORA").slice(0, 8);
}
//Genera el codigo de referido completo "JUANG-1A2B"
function buildReferralCode(name) {
  const prefix = buildReferralPrefix(name);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}
//Valida que no exista el codigo creado 
async function generateUniqueReferralCode(name, options = {}) {
  for (let i = 0; i < REFERRAL_CODE_ATTEMPTS; i += 1) {
    const candidate = buildReferralCode(name);
    const existingCode = await DistributorRepository.findByCode(candidate, options);
    if (!existingCode) {
      return candidate;
    }
  }

  throw createError("No se pudo generar un codigo de referido unico", 500);
}

/**
   * Registrar un nuevo usuario 
   */
export async function registerUser({ email, password, name }) {
  return await sequelize.transaction(async (t) => {
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = normalizeName(name);

    if (!normalizedName) {
      throw createError("El nombre es obligatorio", 400);
    }

    const existingUser = await UserRepository.findByEmail(normalizedEmail, { transaction: t });
    if (existingUser) {
      throw createError("El usuario ya existe", 409);
    }
    //1. Crear usuario
    const passwordHash = await argon2.hash(password);
    const newUser = await UserRepository.create({
      correo: normalizedEmail,
      contrasena: passwordHash,
    }, { transaction: t });

    const codigoReferido = await generateUniqueReferralCode(normalizedName, { transaction: t });
    const fechaVencimientoCodigo = new Date(Date.now() + CODE_VALIDITY_DAYS * 24 * 60 * 60 * 1000);
    //2. Crear distribuidor asociado al usuario
    const newDistributor = await DistributorRepository.create({
      nombre: normalizedName,
      id_usuario: newUser.id_usuario,
      codigo_referido: codigoReferido,
      fecha_vencimiento_codigo: fechaVencimientoCodigo,
    }, { transaction: t });

    return {
      id: newUser.id_usuario,
      email: newUser.correo,
      distributor: {
        id: newDistributor.id_distribuidor,
        nombre: newDistributor.nombre,
        rol: newDistributor.rol,
        codigoReferido: newDistributor.codigo_referido,
        fechaVencimientoCodigo: newDistributor.fecha_vencimiento_codigo,
      },
    };
  });
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
