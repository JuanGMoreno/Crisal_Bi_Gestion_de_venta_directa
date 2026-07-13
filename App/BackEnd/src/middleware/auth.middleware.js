import { createApiError } from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function authMiddleware(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.access_token;

    let token = cookieToken;

    if (authHeader) {
      const [scheme, bearerToken] = authHeader.split(" ");
      if (scheme === "Bearer" && bearerToken) {
        token = bearerToken;
      }
    }

    if (!token) {
      throw createApiError("No autenticado", 401);
    }

    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (error.status === 401) {
      return next(error);
    }

    return next(createApiError("Token inválido o expirado", 401));
  }
}
