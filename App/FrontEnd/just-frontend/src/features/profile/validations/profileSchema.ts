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

export const referralCodeSchema = z.object({
  codigo_referido: z
    .string()
    .trim()
    .min(3, "Ingresa un codigo de referido valido")
    .max(40, "El codigo de referido no puede superar 40 caracteres"),
});

export type ReferralCodeFormInput = z.input<typeof referralCodeSchema>;
export type ReferralCodeFormData = z.output<typeof referralCodeSchema>;
