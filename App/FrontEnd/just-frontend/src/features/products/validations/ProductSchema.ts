import z from 'zod';

export const ProductSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    descripcion: z.string().min(1, 'La descripción es requerida'),
    codigo: z.string().min(1, 'El código es requerido'),
    precio_compra: z.coerce.number().positive('El precio de compra debe ser un número positivo'),
    precio_venta: z.coerce.number().positive('El precio de venta debe ser un número positivo'),
    foto_avatar: z.string().min(1, 'La foto avatar es requerida'),
    estado: z.enum(['Activo', 'Inactivo']).default('Activo'),
});

export type ProductFormData = z.infer<typeof ProductSchema>;