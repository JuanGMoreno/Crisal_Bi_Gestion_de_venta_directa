"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/shared/components/ui/field";
import { ProductCombobox } from "@/features/products/components/ProductCombobox/ProductCombobox";
import { useProductsQuery } from "@/features/products/hooks/useProductsQuery";
import {
  useCreateInventoryEntryMutation,
  useUpdateInventoryEntryMutation,
} from "../../hooks/useInventoryMutations";
import { InventoryEntry } from "../../types/Inventory";
import {
  InventoryEntryFormData,
  InventoryEntryFormInput,
  inventoryEntrySchema,
} from "../../validations/InventoryEntrySchema";

interface InventoryEntryFormProps {
  mode?: "create" | "edit";
  entryId?: string;
  initialEntry?: InventoryEntry | null;
  onSuccess?: () => void;
}

function toDateTimeLocalString(value: Date) {
  const timezoneOffset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function getDefaultInventoryEntryValues(): InventoryEntryFormInput {
  return {
    fecha_ingreso: toDateTimeLocalString(new Date()),
    observacion: "",
    detalles: [
      {
        id_producto: "",
        cantidad_inicial: 1,
        costo_unitario_compra: 0,
        fecha_vencimiento: "",
        numero_lote_fabricacion: "",
      },
    ],
  };
}

function toDateInputString(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function mapEntryToFormValues(entry: InventoryEntry): InventoryEntryFormInput {
  return {
    fecha_ingreso: toDateTimeLocalString(new Date(entry.fecha_ingreso)),
    observacion: entry.observacion || "",
    detalles: entry.detalles.map((detail) => ({
      id_producto: detail.id_producto,
      cantidad_inicial: Number(detail.cantidad_inicial),
      costo_unitario_compra: Number(detail.costo_unitario_compra),
      fecha_vencimiento: toDateInputString(detail.fecha_vencimiento),
      numero_lote_fabricacion: detail.numero_lote_fabricacion || "",
    })),
  };
}

export function InventoryEntryForm({
  mode = "create",
  entryId,
  initialEntry,
  onSuccess,
}: InventoryEntryFormProps) {
  const createInventoryEntryMutation = useCreateInventoryEntryMutation();
  const updateInventoryEntryMutation = useUpdateInventoryEntryMutation();
  const { data: products = [] } = useProductsQuery();
  const activeProducts = products.filter((product) => product.estado === "Activo");

  const form = useForm<InventoryEntryFormInput, unknown, InventoryEntryFormData>({
    resolver: zodResolver(inventoryEntrySchema),
    defaultValues: getDefaultInventoryEntryValues(),
  });

  useEffect(() => {
    if (mode === "edit" && initialEntry) {
      form.reset(mapEntryToFormValues(initialEntry));
      return;
    }

    if (mode === "create") {
      form.reset(getDefaultInventoryEntryValues());
    }
  }, [form, initialEntry, mode]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "detalles",
  });

  const onSubmit = async (data: InventoryEntryFormData) => {
    const payload = {
      fecha_ingreso: new Date(data.fecha_ingreso || new Date().toISOString()).toISOString(),
      observacion: data.observacion?.trim() || undefined,
      detalles: data.detalles.map((detail) => ({
        id_producto: detail.id_producto,
        cantidad_inicial: Number(detail.cantidad_inicial),
        costo_unitario_compra: Number(detail.costo_unitario_compra),
        fecha_vencimiento: detail.fecha_vencimiento
          ? new Date(detail.fecha_vencimiento).toISOString()
          : undefined,
        numero_lote_fabricacion: detail.numero_lote_fabricacion?.trim() || undefined,
      })),
    };

    const submitAction =
      mode === "edit" && entryId
        ? updateInventoryEntryMutation.mutateAsync({ id: entryId, data: payload })
        : createInventoryEntryMutation.mutateAsync(payload);

    await toast.promise(submitAction, {
      loading:
        mode === "edit"
          ? "Actualizando ingreso de inventario..."
          : "Registrando ingreso de inventario...",
      success:
        mode === "edit"
          ? "Ingreso actualizado correctamente"
          : "Ingreso registrado correctamente",
      error: (error) =>
        error instanceof Error
          ? error.message
          : mode === "edit"
            ? "No se pudo actualizar el ingreso"
            : "No se pudo registrar el ingreso",
      position: "top-right",
    });

    if (mode === "create") {
      form.reset(getDefaultInventoryEntryValues());
    }

    onSuccess?.();
  };

  return (
    <form
      id="form-inventory-entry"
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldSet className="w-full">
        <FieldGroup className="gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              name="fecha_ingreso"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="inventory-date">Fecha de ingreso</FieldLabel>
                  <Input
                    {...field}
                    id="inventory-date"
                    type="datetime-local"
                    className="h-9"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />

            <Controller
              name="observacion"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="inventory-note">Observación</FieldLabel>
                  <Textarea
                    {...field}
                    id="inventory-note"
                    placeholder="Notas del ingreso, proveedor o condiciones del lote"
                    className="min-h-[84px]"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Detalle del ingreso</h3>
                <p className="text-sm text-muted-foreground">
                  Selecciona los productos del catálogo y registra el lote real recibido.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    id_producto: "",
                    cantidad_inicial: 1,
                    costo_unitario_compra: 0,
                    fecha_vencimiento: "",
                    numero_lote_fabricacion: "",
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar producto
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((item, index) => (
                <div key={item.id} className="rounded-xl border bg-muted/20 p-4">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">Producto #{index + 1}</p>
                      <p className="text-sm text-muted-foreground">
                        Registra cantidad, costo y trazabilidad del lote.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Controller
                      name={`detalles.${index}.id_producto`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="md:col-span-2 xl:col-span-1">
                          <FieldLabel>Producto</FieldLabel>
                          <ProductCombobox
                            products={activeProducts}
                            value={field.value}
                            invalid={fieldState.invalid}
                            onChange={field.onChange}
                          />
                          {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`detalles.${index}.cantidad_inicial`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`quantity-${index}`}>Cantidad</FieldLabel>
                          <Input
                            id={`quantity-${index}`}
                            type="number"
                            min="1"
                            step="1"
                            className="h-9"
                            value={
                              typeof field.value === "number" || typeof field.value === "string"
                                ? field.value
                                : ""
                            }
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`detalles.${index}.costo_unitario_compra`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`cost-${index}`}>Costo unitario</FieldLabel>
                          <Input
                            id={`cost-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            className="h-9"
                            value={
                              typeof field.value === "number" || typeof field.value === "string"
                                ? field.value
                                : ""
                            }
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`detalles.${index}.fecha_vencimiento`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`expiry-${index}`}>Fecha de vencimiento</FieldLabel>
                          <Input
                            {...field}
                            id={`expiry-${index}`}
                            type="date"
                            className="h-9"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`detalles.${index}.numero_lote_fabricacion`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`lot-${index}`}>Número de lote</FieldLabel>
                          <Input
                            {...field}
                            id={`lot-${index}`}
                            type="text"
                            placeholder="Ej. LT-2026-04"
                            className="h-9"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                        </Field>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
