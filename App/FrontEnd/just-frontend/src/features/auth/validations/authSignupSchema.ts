
import z, { uuid } from "zod";

export const authSignupSchema = z
    .object({
        nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
        correo: z.string().email("Direccion de correo electronico no valida"),
        contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
        confirmarContrasena: z.string().min(6, "Debes confirmar la contraseña"),
        rol: z.enum(['Consultora', 'Lider de Grupo', 'Lider']).default('Consultora'),
        id_distribuidor_padre: uuid("El ID del distribuidor padre debe ser un UUID valido").optional(),
    })
    .refine((data) => data.contraseña === data.confirmarContrasena, {
        path: ["confirmarContrasena"],
        message: "Las contraseñas no coinciden",
    });

export type authSignup = z.infer<typeof authSignupSchema>; 