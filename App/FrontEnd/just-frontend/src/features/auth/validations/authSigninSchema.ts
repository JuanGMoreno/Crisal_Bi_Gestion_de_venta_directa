

import z from "zod";

export const authSigninSchema = z.object({
    correo: z.string().email("Dirección de correo electrónico no válida"),
    contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type AuthSignin = z.infer<typeof authSigninSchema>;
