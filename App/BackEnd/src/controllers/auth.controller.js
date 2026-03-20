import { registerUser, validateUserCredentials } from "../services/auth.service.js";
import { signAccessToken } from "../utils/jwt.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const registerController = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        if (!correo || !contraseña) {
            return res.status(400).json({
                message: "Correo y contraseña son obligatorios",
            });
        }

        if (!EMAIL_REGEX.test(String(correo).trim())) {
            return res.status(400).json({
                message: "El correo no tiene un formato válido",
            });
        }

        if (String(contraseña).length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({
                message: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
            });
        }

        const user = await registerUser({
            email: String(correo).trim().toLowerCase(),
            password: String(contraseña),
        });

        return res.status(201).json({
            message: "Usuario registrado",
            user,
        });
    } catch (error) {
        console.error("Error en registerController:", error);
        return res.status(400).json({
            message: error.message || "Error al registrar",
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        if (!correo || !contraseña) {
            return res.status(400).json({
                message: "Correo y contraseña son obligatorios",
            });
        }

        if (!EMAIL_REGEX.test(String(correo).trim())) {
            return res.status(400).json({
                message: "El correo no tiene un formato válido",
            });
        }

        const user = await validateUserCredentials({
            email: String(correo).trim().toLowerCase(),
            password: String(contraseña),
        });

        if (!user) {
            return res.status(401).json({
                message: "Credenciales inválidas",
            });
        }

        const accessToken = signAccessToken(user);

        return res.json({
            message: "Login correcto",
            accessToken,
            user,
        });
    } catch (error) {
        console.error("Error en loginController:", error);
        return res.status(500).json({
            message: "Error interno",
        });
    }
};

export const meController = async (req, res) => {
    return res.json({
        message: "Ruta protegida",
        user: req.user,
    });
}   ;