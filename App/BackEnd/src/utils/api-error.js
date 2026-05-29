export class ApiError extends Error {
  constructor(message, status = 500, details = undefined) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function createApiError(message, status = 500, details = undefined) {
  return new ApiError(message, status, details);
}

export function badRequest(message, details = undefined) {
  return createApiError(message, 400, details);
}

export function unauthorized(message = 'No autenticado', details = undefined) {
  return createApiError(message, 401, details);
}

export function notFound(message, details = undefined) {
  return createApiError(message, 404, details);
}

export function conflict(message, details = undefined) {
  return createApiError(message, 409, details);
}

export function getErrorStatus(error, fallback = 500) {
  const status = Number(error?.status || error?.statusCode || fallback);
  return status >= 400 && status < 600 ? status : fallback;
}

export function withStatus(error, status) {
  error.status = status;
  return error;
}
