import { ClientRepository } from '../repositories/client.repository.js';

function normalizeOptionalText(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return String(value).trim();
}

function normalizeClientPayload(data) {
  return {
    nombre: String(data.nombre || '').trim(),
    cedula: String(data.cedula || '').trim(),
    direccion: normalizeOptionalText(data.direccion),
    numero_telefono: normalizeOptionalText(data.numero_telefono),
    foto_avatar: normalizeOptionalText(data.foto_avatar),
    edad:
      data.edad === undefined || data.edad === null || data.edad === ''
        ? null
        : Number(data.edad),
    estado: data.estado || 'Activo'
  };
}

function validateClientPayload(data) {
  if (!data.nombre || data.nombre.length < 2) {
    throw new Error('El nombre del cliente debe tener al menos 2 caracteres');
  }

  if (!data.cedula || data.cedula.length < 4) {
    throw new Error('La cedula del cliente debe tener al menos 4 caracteres');
  }

  if (data.edad !== null && (!Number.isInteger(data.edad) || data.edad < 0 || data.edad > 120)) {
    throw new Error('La edad del cliente debe ser un numero entero entre 0 y 120');
  }
}

async function validateUniqueDocument(cedula, currentClientId = null) {
  const existingClient = await ClientRepository.findByDocument(cedula);

  if (!existingClient) return;
  if (currentClientId && existingClient.id_cliente === currentClientId) return;

  throw new Error('Ya existe un cliente con esa cedula');
}

export const ClientService = {
  getClients: async () => {
    return await ClientRepository.findAll({ estado: 'Activo' });
  },

  getClientById: async (id) => {
    const client = await ClientRepository.findById(id);

    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    return client;
  },

  createClient: async (data) => {
    const normalizedData = normalizeClientPayload(data);
    validateClientPayload(normalizedData);
    await validateUniqueDocument(normalizedData.cedula);

    return await ClientRepository.create(normalizedData);
  },

  updateClient: async (id, data) => {
    const normalizedData = normalizeClientPayload(data);
    validateClientPayload(normalizedData);
    await validateUniqueDocument(normalizedData.cedula, id);

    const client = await ClientRepository.update(id, normalizedData);

    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    return client;
  },

  deleteClient: async (id) => {
    const linkedSales = await ClientRepository.countSalesByClient(id);

    if (linkedSales > 0) {
      throw new Error('No se puede eliminar un cliente con ventas asociadas');
    }

    const client = await ClientRepository.softDelete(id);

    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    return { message: 'Cliente eliminado correctamente', client };
  }
};
