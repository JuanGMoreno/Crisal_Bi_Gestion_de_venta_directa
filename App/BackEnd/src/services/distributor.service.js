import { DistributorRepository } from '../repositories/distributor.repository.js';

const CODE_VALIDITY_DAYS = 3;
const REFERRAL_CODE_ATTEMPTS = 5;

function buildReferralPrefix(name) {
  const normalized = String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join('')
    .toUpperCase();

  return (normalized || 'CONSULTORA').slice(0, 8);
}

function buildReferralCode(name) {
  const prefix = buildReferralPrefix(name);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}

async function generateUniqueReferralCode(name) {
  for (let i = 0; i < REFERRAL_CODE_ATTEMPTS; i += 1) {
    const candidate = buildReferralCode(name);
    const existingCode = await DistributorRepository.findByCode(candidate);

    if (!existingCode) {
      return candidate;
    }
  }

  throw new Error('No se pudo generar un codigo de referido unico');
}

function buildProfileResponse(distributor) {
  return {
    id_distribuidor: distributor.id_distribuidor,
    id_usuario: distributor.id_usuario,
    nombre: distributor.nombre,
    rol: distributor.rol,
    foto_avatar: distributor.foto_avatar,
    codigo_referido: distributor.codigo_referido,
    fecha_vencimiento_codigo: distributor.fecha_vencimiento_codigo,
    estado: distributor.estado,
    createdAt: distributor.createdAt,
    updatedAt: distributor.updatedAt,
    usuario: distributor.usuario,
    padre: distributor.padre
  };
}

function normalizeEditableProfilePayload(data) {
  const normalizedName = String(data.nombre || '').trim();
  const normalizedPhoto = data.foto_avatar === undefined
    ? undefined
    : data.foto_avatar === null || data.foto_avatar === ''
      ? null
      : String(data.foto_avatar).trim();

  return {
    nombre: normalizedName,
    foto_avatar: normalizedPhoto
  };
}

function validateEditableProfilePayload(data) {
  if (!data.nombre || data.nombre.length < 2) {
    throw new Error('El nombre del distribuidor debe tener al menos 2 caracteres');
  }
}

async function validateReferralCodeUniqueness(codigoReferido, currentDistributorId = null) {
  if (!codigoReferido) return;

  const existingDistributor = await DistributorRepository.findByCode(codigoReferido);
  if (!existingDistributor) return;

  if (currentDistributorId && existingDistributor.id_distribuidor === currentDistributorId) {
    return;
  }

  throw new Error('Ya existe un distribuidor con ese código de referido');
}

export const DistributorService = {
  /**
   * Obtener todos los distribuidores activos
   */
  getDistributors: async () => {
    const distributors = await DistributorRepository.findAll({ estado: 'Activo' });

    return distributors;
  },

  /**
   * Obtener todos los distribuidores (activos e inactivos)
   */
  getAllDistributors: async () => {
    return await DistributorRepository.findAll();
  },

  /**
   * Obtener distribuidor por ID con validaciones
   */
  getDistributorById: async (id) => {
    const distributor = await DistributorRepository.findById(id);
    
    if (!distributor) {
      throw new Error('Distribuidor no encontrado');
    }
    
    return distributor;
  },

  /**
   * Obtener el perfil completo del distribuidor autenticado
   */
  getCurrentDistributorProfile: async (userId) => {
    const distributor = await DistributorRepository.findProfileByUserId(userId);

    if (!distributor) {
      throw new Error('Distribuidor no encontrado');
    }

    return buildProfileResponse(distributor);
  },

  /**
   * Actualizar el perfil del distribuidor autenticado
   */
  updateCurrentDistributorProfile: async (userId, data) => {
    const distributor = await DistributorRepository.findProfileByUserId(userId);

    if (!distributor) {
      throw new Error('Distribuidor no encontrado');
    }

    const normalizedData = normalizeEditableProfilePayload(data);
    validateEditableProfilePayload(normalizedData);

    const updatedDistributor = await DistributorRepository.update(distributor.id_distribuidor, {
      nombre: normalizedData.nombre,
      ...(normalizedData.foto_avatar !== undefined ? { foto_avatar: normalizedData.foto_avatar } : {})
    });

    return buildProfileResponse({
      ...distributor,
      ...updatedDistributor.dataValues,
      usuario: distributor.usuario,
      padre: distributor.padre
    });
  },

  /**
   * Renovar el codigo de referido del distribuidor autenticado si ya vencio
   */
  renewCurrentDistributorReferralCode: async (userId) => {
    const distributor = await DistributorRepository.findProfileByUserId(userId);

    if (!distributor) {
      throw new Error('Distribuidor no encontrado');
    }

    const currentExpiration = distributor.fecha_vencimiento_codigo
      ? new Date(distributor.fecha_vencimiento_codigo)
      : null;

    if (currentExpiration && currentExpiration.getTime() > Date.now()) {
      throw new Error('El codigo de referido actual aun se encuentra vigente');
    }

    const codigoReferido = await generateUniqueReferralCode(distributor.nombre);
    const fechaVencimientoCodigo = new Date(
      Date.now() + CODE_VALIDITY_DAYS * 24 * 60 * 60 * 1000
    );

    const updatedDistributor = await DistributorRepository.update(distributor.id_distribuidor, {
      codigo_referido: codigoReferido,
      fecha_vencimiento_codigo: fechaVencimientoCodigo
    });

    return buildProfileResponse({
      ...distributor,
      ...updatedDistributor.dataValues,
      usuario: distributor.usuario,
      padre: distributor.padre
    });
  },

  /**
   * Crear distribuidor con validaciones de negocio
   */
  createDistributor: async (data) => {
    await validateReferralCodeUniqueness(data.codigo_referido);

    return await DistributorRepository.create(data);
  },

  /**
   * Actualizar distribuidor con validaciones
   */
  updateDistributor: async (id, data) => {
    await validateReferralCodeUniqueness(data.codigo_referido, id);

    const distributor = await DistributorRepository.update(id, data);

    if (!distributor) {
      throw new Error('Distribuidor no encontrado');
    }

    return distributor;
  },

  /**
   * Eliminar distribuidor (soft delete)
   */
  deleteDistributor: async (id) => {
    const distributor = await DistributorRepository.softDelete(id);
    
    if (!distributor) {
      throw new Error('Distribuidor no encontrado');
    }
    
    return { message: 'Distribuidor eliminado correctamente', distributor };
  },

};
