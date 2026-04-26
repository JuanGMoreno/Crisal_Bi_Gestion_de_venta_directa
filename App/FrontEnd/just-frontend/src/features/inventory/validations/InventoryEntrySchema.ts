import z from "zod";

const inventoryEntryDetailSchema = z.object({
  id_producto: z.string().min(1, "Debes seleccionar un producto"),
  cantidad_inicial: z.coerce
    .number()
    .int("La cantidad debe ser un numero entero")
    .min(1, "La cantidad debe ser mayor que 0"),
  costo_unitario_compra: z.coerce
    .number()
    .min(0, "El costo unitario debe ser mayor o igual a 0"),
  fecha_vencimiento: z.string().trim().optional().or(z.literal("")),
  numero_lote_fabricacion: z
    .string()
    .trim()
    .max(80, "El lote no puede superar 80 caracteres")
    .optional()
    .or(z.literal("")),
});

export const inventoryEntrySchema = z.object({
  fecha_ingreso: z.string().trim().optional().or(z.literal("")),
  observacion: z
    .string()
    .trim()
    .max(500, "La observacion no puede superar 500 caracteres")
    .optional()
    .or(z.literal("")),
  detalles: z
    .array(inventoryEntryDetailSchema)
    .min(1, "Debes agregar al menos un detalle de inventario"),
});

export type InventoryEntryFormInput = z.input<typeof inventoryEntrySchema>;
export type InventoryEntryFormData = z.output<typeof inventoryEntrySchema>;
