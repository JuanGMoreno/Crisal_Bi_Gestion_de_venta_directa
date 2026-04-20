import { DistributorRepository } from '../repositories/distributor.repository.js';

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