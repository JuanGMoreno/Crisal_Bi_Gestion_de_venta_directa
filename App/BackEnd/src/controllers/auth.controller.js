import { registerUser, validateUserCredentials } from "../services/auth.service.js";
import { signAccessToken } from "../utils/jwt.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_NAME_LENGTH = 2;
const AUTH_COOKIE_NAME = "access_token";

function getAuthCookieOptions() {
    const isProd = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
        path: "/",
    };
}

const validateEmail = (email) => {
    return EMAIL_REGEX.test(String(email).trim());
};

export const registerController = async (req, res) => {
    try {
        const { nombre, correo, contraseña } = req.body;
        const normalizedName = String(nombre || "").trim();

        if (!nombre || !correo || !contraseña) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios",
            });
        }

        if (normalizedName.length < MIN_NAME_LENGTH) {
            return res.status(400).json({
                message: `El nombre debe tener al menos ${MIN_NAME_LENGTH} caracteres`,
            });
        }

        if (!validateEmail(correo)) {
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
            name: normalizedName,
            email: String(correo).trim().toLowerCase(),
            password: String(contraseña),
        });

        return res.status(201).json({
            message: "Usuario registrado",
            user,
        });
    } catch (error) {
        console.error("Error en registerController:", error);
        return res.status(error.status || 500).json({
            message: error.message || "Error al registrar",
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        if (!correo || !contraseña) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios",
            });
        }

        if (!validateEmail(correo)) {
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

        res.cookie(AUTH_COOKIE_NAME, accessToken, getAuthCookieOptions());

        return res.json({
            message: "Login correcto",
            user,
        });
    } catch (error) {
        console.error("Error en loginController:", error);
        return res.status(500).json({
            message: "Error interno",
        });
    }
};

export const signoutController = async (_req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    });

    return res.json({
        message: "Sesion cerrada",
    });
};

export const meController = async (req, res) => {
    return res.json({
        message: "Ruta protegida",
        user: req.user,
    });
}   ;