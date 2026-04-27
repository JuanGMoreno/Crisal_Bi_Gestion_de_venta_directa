import { DistributorService } from '../services/distributor.service.js';

function assignUploadedImageToBody(req) {
  const uploadedImageUrl = req.file
    ? (req.file.path || req.file.secure_url || req.file.url || null)
    : null;

  if (Array.isArray(req.body?.foto_avatar)) {
    req.body.foto_avatar = req.body.foto_avatar[0] ?? null;
  } else if (req.body?.foto_avatar && typeof req.body.foto_avatar === 'object') {
    req.body.foto_avatar =
      req.body.foto_avatar.path ||
      req.body.foto_avatar.secure_url ||
      req.body.foto_avatar.url ||
      null;
  }

  if (uploadedImageUrl) {
    req.body.foto_avatar = uploadedImageUrl;
  }
}

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
 * Obtener el perfil del distribuidor autenticado
 */
export const getCurrentDistributorProfile = async (req, res) => {
  try {
    const profile = await DistributorService.getCurrentDistributorProfile(req.user.id);
    res.status(200).json(profile);
  } catch (error) {
    const statusCode = error.message === 'Distribuidor no encontrado' ? 404 : 500;
    res.status(statusCode).json({
      message: error.message
    });
  }
};

/**
 * Actualizar el perfil del distribuidor autenticado
 */
export const updateCurrentDistributorProfile = async (req, res) => {
  assignUploadedImageToBody(req);

  try {
    const profile = await DistributorService.updateCurrentDistributorProfile(req.user.id, req.body);
    res.status(200).json(profile);
  } catch (error) {
    const statusCode = error.message === 'Distribuidor no encontrado' ? 404 : 400;
    res.status(statusCode).json({
      message: error.message
    });
  }
};

/**
 * Renovar el codigo de referido del distribuidor autenticado
 */
export const renewCurrentDistributorReferralCode = async (req, res) => {
  try {
    const profile = await DistributorService.renewCurrentDistributorReferralCode(req.user.id);
    res.status(200).json({
      message: 'Codigo de referido renovado correctamente',
      profile
    });
  } catch (error) {
    const statusCode =
      error.message === 'Distribuidor no encontrado'
        ? 404
        : error.message === 'El codigo de referido actual aun se encuentra vigente'
          ? 400
          : 500;

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
