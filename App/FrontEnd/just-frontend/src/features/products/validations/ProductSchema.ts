import z from 'zod';

export const ProductSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    descripcion: z.string().min(1, 'La descripción es requerida'),
    codigo: z.string().min(1, 'El código es requerido'),
    precio_compra: z.coerce.number().positive('Debe ser un número positivo'),
    precio_venta: z.coerce.number().positive('Debe ser un número positivo'),
    foto_avatar: z.string().min(1, 'La foto avatar es requerida'),
    estado: z.enum(['Activo', 'Inactivo']).default('Activo'),
}).refine((data) => data.precio_venta > data.precio_compra , {
    message: 'El precio de venta debe ser mayor que el precio de compra',
    path: ['precio_venta'],
});
    


export type ProductFormData = z.infer<typeof ProductSchema>;