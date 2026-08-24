import z from "zod";

export const profileSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre no puede superar 120 caracteres"),
  foto_avatar: z
    .string()
    .trim()
    .max(500, "La foto no puede superar 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormInput = z.input<typeof profileSchema>;
export type ProfileFormData = z.output<typeof profileSchema>;
