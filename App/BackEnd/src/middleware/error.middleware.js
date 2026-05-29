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

export function errorMiddleware(error, _req, res, _next) {
  const status = getErrorStatus(error, getStatusFromKnownError(error) || 500);
  const message =
    status >= 500 && !(error instanceof ApiError)
      ? 'Error interno del servidor'
      : error.message || 'Error interno del servidor';

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
