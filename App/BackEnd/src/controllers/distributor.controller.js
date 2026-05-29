import { DistributorService } from '../services/distributor.service.js';
import { createApiError, withStatus } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';

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

export const getDistributors = asyncHandler(async (_req, res) => {
  const distributors = await DistributorService.getDistributors();

  if (distributors.length === 0) {
    throw createApiError('No se encontraron distribuidores', 404);
  }

  return res.status(200).json(distributors);
});

export const getDistributor = asyncHandler(async (req, res) => {
  try {
    const distributor = await DistributorService.getDistributorById(req.params.id);
    return res.status(200).json(distributor);
  } catch (error) {
    throw withStatus(error, error.message === 'Distribuidor no encontrado' ? 404 : 500);
  }
});

export const getCurrentDistributorProfile = asyncHandler(async (req, res) => {
  try {
    const profile = await DistributorService.getCurrentDistributorProfile(req.user.id);
    return res.status(200).json(profile);
  } catch (error) {
    throw withStatus(error, error.message === 'Distribuidor no encontrado' ? 404 : 500);
  }
});

export const updateCurrentDistributorProfile = asyncHandler(async (req, res) => {
  assignUploadedImageToBody(req);

  try {
    const profile = await DistributorService.updateCurrentDistributorProfile(req.user.id, req.body);
    return res.status(200).json(profile);
  } catch (error) {
    throw withStatus(error, error.message === 'Distribuidor no encontrado' ? 404 : 400);
  }
});

export const renewCurrentDistributorReferralCode = asyncHandler(async (req, res) => {
  try {
    const profile = await DistributorService.renewCurrentDistributorReferralCode(req.user.id);
    return res.status(200).json({
      message: 'Codigo de referido renovado correctamente',
      profile
    });
  } catch (error) {
    const status =
      error.message === 'Distribuidor no encontrado'
        ? 404
        : error.message === 'El codigo de referido actual aun se encuentra vigente'
          ? 400
          : 500;

    throw withStatus(error, status);
  }
});

export const linkCurrentDistributorByReferralCode = asyncHandler(async (req, res) => {
  try {
    const profile = await DistributorService.linkCurrentDistributorByReferralCode(
      req.user.id,
      req.body.codigo_referido
    );

    return res.status(200).json({
      message: 'Distribuidor vinculado correctamente',
      profile
    });
  } catch (error) {
    const status = error.message === 'Distribuidor no encontrado' ? 404 : 400;
    throw withStatus(error, status);
  }
});

export const getCurrentDistributorChildren = asyncHandler(async (req, res) => {
  try {
    const children = await DistributorService.getCurrentDistributorChildren(req.user.id);
    return res.status(200).json(children);
  } catch (error) {
    throw withStatus(error, error.message === 'Distribuidor no encontrado' ? 404 : 500);
  }
});

export const createDistributor = asyncHandler(async (req, res) => {
  try {
    const distributor = await DistributorService.createDistributor(req.body);
    return res.status(201).json(distributor);
  } catch (error) {
    throw withStatus(error, 400);
  }
});

export const updateDistributor = asyncHandler(async (req, res) => {
  try {
    const distributor = await DistributorService.updateDistributor(req.params.id, req.body);
    return res.status(200).json(distributor);
  } catch (error) {
    throw withStatus(error, error.message === 'Distribuidor no encontrado' ? 404 : 400);
  }
});

export const deleteDistributor = asyncHandler(async (req, res) => {
  try {
    const result = await DistributorService.deleteDistributor(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    throw withStatus(error, error.message === 'Distribuidor no encontrado' ? 404 : 500);
  }
});
