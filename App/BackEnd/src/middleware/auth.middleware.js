import { verifyAccessToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
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
      return res.status(401).json({
        message: "No autenticado",
      });
    }

    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
    
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
}