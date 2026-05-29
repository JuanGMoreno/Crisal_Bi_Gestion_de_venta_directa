import { DistributorRepository } from '../repositories/distributor.repository.js';

const CODE_VALIDITY_DAYS = 3;
const REFERRAL_CODE_ATTEMPTS = 5;
const MAX_DIRECT_CHILDREN = 15;
const ROLE_LEVELS = {
  'Consultora': 1,
  'Lider de Grupo': 2,
  'Lider': 3
};
const ALLOWED_ROLES = new Set(Object.keys(ROLE_LEVELS));

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

function buildChildResponse(distributor) {
  return {
    id_distribuidor: distributor.id_distribuidor,
    id_usuario: distributor.id_usuario,
    nombre: distributor.nombre,
    rol: distributor.rol,
    foto_avatar: distributor.foto_avatar,
    estado: distributor.estado,
    createdAt: distributor.createdAt,
    updatedAt: distributor.updatedAt,
    usuario: distributor.usuario
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

function normalizeOptionalParentId(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  return String(value);
}

function normalizeRole(value, fallback = 'Consultora') {
  const role = value || fallback;

  if (!ALLOWED_ROLES.has(role)) {
    throw new Error('Rol de distribuidor invalido');
  }

  return role;
}

function getRoleLevel(role) {
  return ROLE_LEVELS[role] || 0;
}

function assertParentHasHigherRole(parent, childRole) {
  if (getRoleLevel(parent.rol) <= getRoleLevel(childRole)) {
    throw new Error('El distribuidor padre debe tener un rol superior al distribuidor hijo');
  }
}

function assertRoleCanKeepChildren(role, children = []) {
  const invalidChild = children.find((child) => getRoleLevel(role) <= getRoleLevel(child.rol));

  if (invalidChild) {
    throw new Error('No se puede asignar un rol igual o menor al rol de un distribuidor hijo');
  }
}

async function assertParentDoesNotCreateCycle(distributorId, parentId) {
  if (!distributorId || !parentId) return;

  const visited = new Set();
  let currentParentId = parentId;

  while (currentParentId) {
    if (currentParentId === distributorId) {
      throw new Error('No se puede asignar como padre a un descendiente del distribuidor');
    }

    if (visited.has(currentParentId)) {
      throw new Error('La jerarquia de distribuidores contiene un ciclo');
    }

    visited.add(currentParentId);

    const currentParent = await DistributorRepository.findById(currentParentId);
    currentParentId = currentParent?.id_distribuidor_padre || null;
  }
}

async function assertParentHasAvailableCapacity(parentId, currentDistributor = null) {
  if (!parentId) return;

  const isAlreadyChildOfParent =
    currentDistributor?.id_distribuidor_padre &&
    currentDistributor.id_distribuidor_padre === parentId;

  if (isAlreadyChildOfParent) return;

  const activeChildrenCount = await DistributorRepository.countByParent(parentId, {
    estado: 'Activo'
  });

  if (activeChildrenCount >= MAX_DIRECT_CHILDREN) {
    throw new Error(`El distribuidor padre no puede tener mas de ${MAX_DIRECT_CHILDREN} hijos activos`);
  }
}

async function validateHierarchyRules({
  distributorId = null,
  currentDistributor = null,
  role,
  parentId
}) {
  const normalizedRole = normalizeRole(role, currentDistributor?.rol);
  const normalizedParentId =
    parentId === undefined
      ? currentDistributor?.id_distribuidor_padre || null
      : normalizeOptionalParentId(parentId);

  if (distributorId && normalizedParentId === distributorId) {
    throw new Error('Un distribuidor no puede asignarse como padre de si mismo');
  }

  if (normalizedParentId) {
    const parent = await DistributorRepository.findById(normalizedParentId);

    if (!parent) {
      throw new Error('Distribuidor padre no encontrado');
    }

    if (parent.estado !== 'Activo') {
      throw new Error('No se puede asignar un distribuidor padre inactivo');
    }

    assertParentHasHigherRole(parent, normalizedRole);
    await assertParentDoesNotCreateCycle(distributorId, normalizedParentId);
    await assertParentHasAvailableCapacity(normalizedParentId, currentDistributor);
  }

  if (distributorId) {
    const children = await DistributorRepository.findChildrenByParent(distributorId, {
      estado: 'Activo'
    });
    assertRoleCanKeepChildren(normalizedRole, children);
  }

  return {
    rol: normalizedRole,
    id_distribuidor_padre: normalizedParentId
  };
}

function normalizeReferralCode(value) {
  return String(value || '').trim().toUpperCase();
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
   * Vincular el distribuidor autenticado a una jerarquia mediante codigo de referido
   */
  linkCurrentDistributorByReferralCode: async (userId, codigoReferido) => {
    const normalizedCode = normalizeReferralCode(codigoReferido);

    if (!normalizedCode) {
      throw new Error('Debes ingresar un codigo de referido');
    }

    const distributor = await DistributorRepository.findProfileByUserId(userId);

    if (!distributor) {
      throw new Error('Distribuidor no encontrado');
    }

    if (distributor.id_distribuidor_padre) {
      throw new Error('El distribuidor ya se encuentra vinculado a una jerarquia');
    }

    const parent = await DistributorRepository.findByCode(normalizedCode);

    if (!parent) {
      throw new Error('Codigo de referido no encontrado');
    }

    if (parent.id_distribuidor === distributor.id_distribuidor) {
      throw new Error('No puedes vincularte usando tu propio codigo de referido');
    }

    const expirationDate = parent.fecha_vencimiento_codigo
      ? new Date(parent.fecha_vencimiento_codigo)
      : null;

    if (!expirationDate || expirationDate.getTime() <= Date.now()) {
      throw new Error('El codigo de referido se encuentra vencido');
    }

    const hierarchyData = await validateHierarchyRules({
      distributorId: distributor.id_distribuidor,
      currentDistributor: distributor,
      role: distributor.rol,
      parentId: parent.id_distribuidor
    });

    await DistributorRepository.update(distributor.id_distribuidor, {
      id_distribuidor_padre: hierarchyData.id_distribuidor_padre
    });

    const updatedDistributor = await DistributorRepository.findProfileByUserId(userId);

    return buildProfileResponse(updatedDistributor);
  },

  /**
   * Listar hijos directos activos del distribuidor autenticado
   */
  getCurrentDistributorChildren: async (userId) => {
    const distributor = await DistributorRepository.findByUserId(userId);

    if (!distributor) {
      throw new Error('Distribuidor no encontrado');
    }

    const children = await DistributorRepository.findChildrenWithUserByParent(
      distributor.id_distribuidor,
      { estado: 'Activo' }
    );

    return children.map(buildChildResponse);
  },

  /**
   * Crear distribuidor con validaciones de negocio
   */
  createDistributor: async (data) => {
    await validateReferralCodeUniqueness(data.codigo_referido);
    const hierarchyData = await validateHierarchyRules({
      role: data.rol,
      parentId: data.id_distribuidor_padre
    });

    return await DistributorRepository.create({
      ...data,
      rol: hierarchyData.rol,
      id_distribuidor_padre: hierarchyData.id_distribuidor_padre
    });
  },

  /**
   * Actualizar distribuidor con validaciones
   */
  updateDistributor: async (id, data) => {
    await validateReferralCodeUniqueness(data.codigo_referido, id);

    const currentDistributor = await DistributorRepository.findById(id);

    if (!currentDistributor) {
      throw new Error('Distribuidor no encontrado');
    }

    const hierarchyData = await validateHierarchyRules({
      distributorId: id,
      currentDistributor,
      role: data.rol,
      parentId: data.id_distribuidor_padre
    });

    const distributor = await DistributorRepository.update(id, {
      ...data,
      ...(data.rol !== undefined ? { rol: hierarchyData.rol } : {}),
      ...(data.id_distribuidor_padre !== undefined
        ? { id_distribuidor_padre: hierarchyData.id_distribuidor_padre }
        : {})
    });

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
