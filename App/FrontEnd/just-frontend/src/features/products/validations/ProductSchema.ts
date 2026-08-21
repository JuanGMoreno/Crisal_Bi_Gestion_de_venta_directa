import z from 'zod';

export const ProductSchema = z.object({
    nombre: z.string().trim().min(1, 'El nombre es requerido').max(100, 'El nombre no puede superar 100 caracteres'),
    descripcion: z.string().trim().min(1, 'La descripción es requerida').max(1000, 'La descripción no puede superar 1000 caracteres'),
    codigo: z.string().trim().min(1, 'El código es requerido').max(4, 'El código no puede superar 4 caracteres').min(4, 'El código debe tener exactamente 4 caracteres'),
    precio_base_venta: z.coerce.number().positive('El precio base de venta debe ser un número positivo'),
    foto_avatar: z.string().trim().optional(),
    estado: z.enum(['Activo', 'Inactivo']).default('Activo'),
    categoria: z.string().trim().max(80, 'La categoría no puede superar 80 caracteres').optional(),
});
    


export type ProductFormData = z.infer<typeof ProductSchema>;
