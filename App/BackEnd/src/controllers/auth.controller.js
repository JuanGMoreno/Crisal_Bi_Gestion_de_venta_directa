import { registerUser, validateUserCredentials } from "../services/auth.service.js";
import { createApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
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

export const registerController = asyncHandler(async (req, res) => {
    const { nombre, correo, contraseña } = req.body;
    const normalizedName = String(nombre || "").trim();

    if (!nombre || !correo || !contraseña) {
        throw createApiError("Todos los campos son obligatorios", 400);
    }

    if (normalizedName.length < MIN_NAME_LENGTH) {
        throw createApiError(`El nombre debe tener al menos ${MIN_NAME_LENGTH} caracteres`, 400);
    }

    if (!validateEmail(correo)) {
        throw createApiError("El correo no tiene un formato válido", 400);
    }

    if (String(contraseña).length < MIN_PASSWORD_LENGTH) {
        throw createApiError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`, 400);
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
});

export const loginController = asyncHandler(async (req, res) => {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
        throw createApiError("Todos los campos son obligatorios", 400);
    }

    if (!validateEmail(correo)) {
        throw createApiError("El correo no tiene un formato válido", 400);
    }

    const user = await validateUserCredentials({
        email: String(correo).trim().toLowerCase(),
        password: String(contraseña),
    });

    if (!user) {
        throw createApiError("Credenciales inválidas", 401);
    }

    const accessToken = signAccessToken(user);

    res.cookie(AUTH_COOKIE_NAME, accessToken, getAuthCookieOptions());

    return res.json({
        message: "Login correcto",
        user,
    });
});

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

export const meController = async (_req, res) => {
    return res.json({
        message: "Ruta protegida",
        user: _req.user,
    });
};
