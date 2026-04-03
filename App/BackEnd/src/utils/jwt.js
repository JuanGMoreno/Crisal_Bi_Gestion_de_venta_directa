import jwt from "jsonwebtoken";

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("Falta JWT_SECRET en variables de entorno");
  }

  return jwtSecret;
}

//Generar el token de acceso con la informacion del usuario
export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
      issuer: "mi-api",
      audience: "mi-app",
    }
  );
}
//verificar el token de acceso para proteger las rutas privadas
export function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret(), {
    issuer: "mi-api",
    audience: "mi-app",
  });
}