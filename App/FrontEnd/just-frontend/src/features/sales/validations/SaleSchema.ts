import z from "zod";

const saleDetailSchema = z.object({
  id_producto: z.string().min(1, "Debes seleccionar un producto"),
  cantidad: z.coerce
    .number()
    .int("La cantidad debe ser un numero entero")
    .min(1, "La cantidad debe ser mayor que 0"),
  precio_unitario: z.union([
    z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
    z.literal(""),
  ]),
  descuento_unitario: z.coerce
    .number()
    .min(0, "El descuento debe ser mayor o igual a 0"),
});

export const saleSchema = z.object({
  id_cliente: z.string().trim().min(1, "Debes seleccionar un cliente"),
  fecha_venta: z.string().trim().optional().or(z.literal("")),
  estado: z.enum(["Abierta", "Cerrada"]),
  detalles: z.array(saleDetailSchema).min(1, "Debes agregar al menos un producto"),
});

export type SaleFormInput = z.input<typeof saleSchema>;
export type SaleFormData = z.output<typeof saleSchema>;

