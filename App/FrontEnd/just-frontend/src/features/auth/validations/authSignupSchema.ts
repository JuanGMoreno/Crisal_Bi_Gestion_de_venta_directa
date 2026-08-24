
import z from "zod";

export const authSignupSchema = z
    .object({
        nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
        correo: z.string().email("Direccion de correo electronico no valida"),
        contraseña: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
        confirmarContrasena: z.string().min(8, "Debes confirmar la contraseña"),
    })
    .refine((data) => data.contraseña === data.confirmarContrasena, {
        path: ["confirmarContrasena"],
        message: "Las contraseñas no coinciden",
    });

export type authSignup = z.infer<typeof authSignupSchema>;
