import { DistributorService } from '../services/distributor.service.js';
import { withStatus } from '../utils/api-error.js';
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
