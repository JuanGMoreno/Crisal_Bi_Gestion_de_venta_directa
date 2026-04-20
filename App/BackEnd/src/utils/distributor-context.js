import { DistributorRepository } from '../repositories/distributor.repository.js';

export async function resolveDistributorIdByUserId(userId) {
  const distributor = await DistributorRepository.findByUserId(userId);

  if (!distributor) {
    throw new Error('Distribuidor no encontrado para el usuario autenticado');
  }

  return distributor.id_distribuidor;
}
