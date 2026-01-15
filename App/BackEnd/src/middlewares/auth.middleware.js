import jwt from 'jsonwebtoken';
const JWT_SECRET = 'tu_llave_secreta_para_la_tesis';

export const verifyToken = (req, res, next) => {
    // El token suele venir en el header "Authorization" como: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "No se proporcionó un token de acceso" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Guardamos los datos del usuario (id y role) en el request
        next(); // Si todo está bien, pasamos a la función del controlador
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};