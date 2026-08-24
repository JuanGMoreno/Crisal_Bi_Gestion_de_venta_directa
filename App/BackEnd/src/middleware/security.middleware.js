import rateLimit from 'express-rate-limit';
import { createApiError } from '../utils/api-error.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function getPositiveInteger(value, fallback) {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

export function getAllowedOrigins() {
  const configuredOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:3000';

  return new Set(
    configuredOrigins
      .split(',')
      .map((origin) => origin.trim().replace(/\/$/, ''))
      .filter(Boolean)
  );
}

export function isAllowedOrigin(origin) {
  if (!origin) return false;
  return getAllowedOrigins().has(origin.replace(/\/$/, ''));
}

export const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(createApiError('Origen no permitido', 403));
  }
};

export function originProtectionMiddleware(req, _res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  const authorization = req.headers.authorization || '';
  const usesBearerToken = authorization.startsWith('Bearer ');
  const usesAuthenticationCookie = Boolean(req.cookies?.access_token);

  if (!usesAuthenticationCookie || usesBearerToken) return next();

  if (isAllowedOrigin(req.headers.origin)) return next();

  return next(createApiError('Solicitud rechazada por origen no permitido', 403));
}

function createLimiter({ windowMs, limit, message, skipSuccessfulRequests = false }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (_req, res) => res.status(429).json({ message })
  });
}

export const apiRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: getPositiveInteger(process.env.API_RATE_LIMIT, 500),
  message: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.'
});

export const authRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: getPositiveInteger(process.env.AUTH_RATE_LIMIT, 10),
  skipSuccessfulRequests: true,
  message: 'Demasiados intentos de acceso. Espera unos minutos antes de intentarlo nuevamente.'
});

export function requestLoggerMiddleware(req, res, next) {
  const startedAt = Date.now();

  res.once('finish', () => {
    const safeMethod = String(req.method).replace(/[\r\n]/g, '');
    const safePath = String(req.originalUrl).replace(/[\r\n]/g, '');
    console.info(`${safeMethod} ${safePath} ${res.statusCode} ${Date.now() - startedAt}ms`);
  });

  next();
}
