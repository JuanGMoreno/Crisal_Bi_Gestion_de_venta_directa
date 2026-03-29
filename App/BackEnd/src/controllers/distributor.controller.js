import { DistributorService } from '../services/distributor.service.js';

/**
 * Obtener todos los distribuidores
 */
export const getDistributors = async (req, res) => {
  try {
    const distributors = await DistributorService.getDistributors();
    if (distributors.length === 0) {
      res.status(404).json({ message: 'No se encontraron distribuidores' });
    } else {
    res.status(200).json(distributors);
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener distribuidores', 
      error: error.message 
    });
  }
};

/**
 * Obtener un distribuidor por ID
 */
export const getDistributor = async (req, res) => {
  try {
    const { id } = req.params;
    const distributor = await DistributorService.getDistributorById(id);
    res.status(200).json(distributor);
  } catch (error) {
    const statusCode = error.message === 'Distribuidor no encontrado' ? 404 : 500;
    res.status(statusCode).json({ 
      message: error.message 
    });
  }
};

/**
 * Crear un nuevo distribuidor
 */
export const createDistributor = async (req, res) => {
  try {
    const distributor = await DistributorService.createDistributor(req.body);
    res.status(201).json(distributor);
  } catch (error) {
    res.status(400).json({ 
      message: error.message 
    });
  }
};

/**
 * Actualizar un distribuidor existente
 */
export const updateDistributor = async (req, res) => {
  try {
    const { id } = req.params;
    const distributor = await DistributorService.updateDistributor(id, req.body);
    res.status(200).json(distributor);
  } catch (error) {
    const statusCode = error.message === 'Distribuidor no encontrado' ? 404 : 400;
    res.status(statusCode).json({ 
      message: error.message 
    });
  }
};

/**
 * Eliminar un distribuidor (soft delete)
 */
export const deleteDistributor = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DistributorService.deleteDistributor(id);
    res.json(result);
  } catch (error) {
    const statusCode = error.message === 'Distribuidor no encontrado' ? 404 : 500;
    res.status(statusCode).json({ 
      message: error.message 
    });
  }
};
