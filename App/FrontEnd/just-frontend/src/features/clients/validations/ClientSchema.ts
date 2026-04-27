import z from "zod";

export const clientSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre no puede superar 120 caracteres"),
  cedula: z
    .string()
    .trim()
    .min(4, "La cedula debe tener al menos 4 caracteres")
    .max(30, "La cedula no puede superar 30 caracteres"),
  direccion: z
    .string()
    .trim()
    .max(200, "La direccion no puede superar 200 caracteres")
    .optional()
    .or(z.literal("")),
  edad: z.union([
    z.coerce.number().int("La edad debe ser un numero entero").min(0).max(120),
    z.literal(""),
  ]),
  numero_telefono: z
    .string()
    .trim()
    .max(30, "El numero de telefono no puede superar 30 caracteres")
    .optional()
    .or(z.literal("")),
  foto_avatar: z
    .string()
    .trim()
    .max(500, "La foto no puede superar 500 caracteres")
    .optional()
    .or(z.literal("")),
  estado: z.literal("Activo").default("Activo"),
});

export type ClientFormInput = z.input<typeof clientSchema>;
export type ClientFormData = z.output<typeof clientSchema>;
