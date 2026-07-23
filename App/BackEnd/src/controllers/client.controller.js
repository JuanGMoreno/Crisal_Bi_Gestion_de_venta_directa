import { ClientService } from '../services/client.service.js';
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

export const getClients = asyncHandler(async (req, res) => {
  const clients = await ClientService.getClients(req.user.id);
  return res.status(200).json(clients);
});

export const getClient = asyncHandler(async (req, res) => {
  try {
    const client = await ClientService.getClientById(req.params.id, req.user.id);
    return res.status(200).json(client);
  } catch (error) {
    throw withStatus(error, error.message === 'Cliente no encontrado' ? 404 : 500);
  }
});

export const createClient = asyncHandler(async (req, res) => {
  assignUploadedImageToBody(req);

  try {
    const client = await ClientService.createClient(req.body, req.user.id);
    return res.status(201).json(client);
  } catch (error) {
    throw withStatus(error, 400);
  }
});

export const updateClient = asyncHandler(async (req, res) => {
  assignUploadedImageToBody(req);

  try {
    const client = await ClientService.updateClient(req.params.id, req.body, req.user.id);
    return res.status(200).json(client);
  } catch (error) {
    throw withStatus(error, error.message === 'Cliente no encontrado' ? 404 : 400);
  }
});

export const deleteClient = asyncHandler(async (req, res) => {
  try {
    const result = await ClientService.deleteClient(req.params.id, req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    throw withStatus(error, error.message === 'Cliente no encontrado' ? 404 : 400);
  }
});
