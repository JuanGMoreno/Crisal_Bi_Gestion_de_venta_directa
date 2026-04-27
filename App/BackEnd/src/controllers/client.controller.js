import { ClientService } from '../services/client.service.js';

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

export const getClients = async (_req, res) => {
  try {
    const clients = await ClientService.getClients();

    if (clients.length === 0) {
      return res.status(404).json({ message: 'No se encontraron clientes' });
    }

    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener clientes',
      error: error.message
    });
  }
};

export const getClient = async (req, res) => {
  try {
    const client = await ClientService.getClientById(req.params.id);
    return res.status(200).json(client);
  } catch (error) {
    const statusCode = error.message === 'Cliente no encontrado' ? 404 : 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

export const createClient = async (req, res) => {
  assignUploadedImageToBody(req);

  try {
    const client = await ClientService.createClient(req.body);
    return res.status(201).json(client);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateClient = async (req, res) => {
  assignUploadedImageToBody(req);

  try {
    const client = await ClientService.updateClient(req.params.id, req.body);
    return res.status(200).json(client);
  } catch (error) {
    const statusCode = error.message === 'Cliente no encontrado' ? 404 : 400;
    return res.status(statusCode).json({ message: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const result = await ClientService.deleteClient(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message === 'Cliente no encontrado' ? 404 : 400;
    return res.status(statusCode).json({ message: error.message });
  }
};
