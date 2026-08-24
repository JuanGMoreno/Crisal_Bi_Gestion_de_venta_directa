import { ApiError, getErrorStatus, notFound } from '../utils/api-error.js';

export function notFoundMiddleware(req, _res, next) {
  next(notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

function getStatusFromKnownError(error) {
  if (error?.name === 'SequelizeValidationError' || error?.name === 'SequelizeUniqueConstraintError') {
    return 400;
  }

  if (error?.name === 'MulterError') {
    return 400;
  }

  return undefined;
}

function getDetailsFromKnownError(error) {
  if (Array.isArray(error?.errors)) {
    return error.errors.map((item) => ({
      field: item.path,
      message: item.message
    }));
  }

  return error.details;
}

function getMessageFromKnownError(error) {
  if (error?.name === 'SequelizeUniqueConstraintError') {
    return 'Ya existe un registro con esos datos.';
  }

  if (error?.name === 'MulterError') {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return 'La imagen supera el tamaño máximo permitido de 5 MB.';
    }

    return 'La imagen enviada no cumple los límites permitidos.';
  }

  return undefined;
}

export function errorMiddleware(error, _req, res, _next) {
  const status = getErrorStatus(error, getStatusFromKnownError(error) || 500);
  const message =
    status >= 500 && !(error instanceof ApiError)
      ? 'Error interno del servidor'
      : getMessageFromKnownError(error) || error.message || 'Error interno del servidor';

  if (status >= 500) {
    console.error(error);
  }

  const response = { message };

  const details = getDetailsFromKnownError(error);

  if (details !== undefined) {
    response.details = details;
  }

  return res.status(status).json(response);
}
