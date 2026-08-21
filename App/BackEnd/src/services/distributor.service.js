import { DistributorRepository } from '../repositories/distributor.repository.js';

function buildProfileResponse(distributor) {
  return {
    id_distribuidor: distributor.id_distribuidor,
    id_usuario: distributor.id_usuario,
    nombre: distributor.nombre,
    foto_avatar: distributor.foto_avatar,
    estado: distributor.estado,
    createdAt: distributor.createdAt,
    updatedAt: distributor.updatedAt,
    usuario: distributor.usuario
  };
}

function normalizeEditableProfilePayload(data) {
  return {
    nombre: String(data.nombre || '').trim(),
    foto_avatar: data.foto_avatar === undefined
      ? undefined
      : data.foto_avatar === null || data.foto_avatar === ''
        ? null
        : String(data.foto_avatar).trim()
  };
}

function validateEditableProfilePayload(data) {
  if (!data.nombre || data.nombre.length < 2) {
    throw new Error('El nombre del negocio debe tener al menos 2 caracteres');
  }
}

function sanitizeDistributorPayload(data) {
  const allowedFields = ['id_usuario', 'nombre', 'foto_avatar', 'estado'];
  return Object.fromEntries(
    allowedFields
      .filter((field) => data[field] !== undefined)
      .map((field) => [field, data[field]])
  );
}

export const DistributorService = {
  getDistributors: async () => {
    return await DistributorRepository.findAll({ estado: 'Activo' });
  },

  getAllDistributors: async () => {
    return await DistributorRepository.findAll();
  },

  getDistributorById: async (id) => {
    const distributor = await DistributorRepository.findById(id);
    if (!distributor) throw new Error('Distribuidor no encontrado');
    return distributor;
  },

  getCurrentDistributorProfile: async (userId) => {
    const distributor = await DistributorRepository.findProfileByUserId(userId);
    if (!distributor) throw new Error('Distribuidor no encontrado');
    return buildProfileResponse(distributor);
  },

  updateCurrentDistributorProfile: async (userId, data) => {
    const distributor = await DistributorRepository.findProfileByUserId(userId);
    if (!distributor) throw new Error('Distribuidor no encontrado');

    const normalizedData = normalizeEditableProfilePayload(data);
    validateEditableProfilePayload(normalizedData);
    const updatedDistributor = await DistributorRepository.update(distributor.id_distribuidor, {
      nombre: normalizedData.nombre,
      ...(normalizedData.foto_avatar !== undefined ? { foto_avatar: normalizedData.foto_avatar } : {})
    });

    return buildProfileResponse({
      ...distributor,
      ...updatedDistributor.dataValues,
      usuario: distributor.usuario
    });
  },

  createDistributor: async (data) => {
    return await DistributorRepository.create(sanitizeDistributorPayload(data));
  },

  updateDistributor: async (id, data) => {
    const distributor = await DistributorRepository.update(id, sanitizeDistributorPayload(data));
    if (!distributor) throw new Error('Distribuidor no encontrado');
    return distributor;
  },

  deleteDistributor: async (id) => {
    const distributor = await DistributorRepository.softDelete(id);
    if (!distributor) throw new Error('Distribuidor no encontrado');
    return { message: 'Distribuidor eliminado correctamente', distributor };
  }
};
