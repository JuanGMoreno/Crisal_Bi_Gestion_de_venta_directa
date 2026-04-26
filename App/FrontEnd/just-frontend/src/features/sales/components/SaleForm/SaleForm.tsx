"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useProductsQuery } from "@/features/products/hooks/useProductsQuery";
import { useInventorySummaryQuery } from "@/features/inventory/hooks/useInventorySummaryQuery";
import { useCreateSaleMutation } from "../../hooks/useSaleMutations";
import { useSaleClientsQuery } from "../../hooks/useSaleClientsQuery";
import { SaleFormData, SaleFormInput, saleSchema } from "../../validations/SaleSchema";

interface SaleFormProps {
  onSuccess?: () => void;
}

function toDateTimeLocalString(value: Date) {
  const timezoneOffset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 2,
  }).format(value);
}

export function SaleForm({ onSuccess }: SaleFormProps) {
  const createSaleMutation = useCreateSaleMutation();
  const { data: products = [] } = useProductsQuery();
  const { data: clients = [] } = useSaleClientsQuery();
  const { data: inventorySummary = [] } = useInventorySummaryQuery();

  const activeProducts = products.filter((product) => product.estado === "Activo");
  const stockByProduct = new Map(
    inventorySummary.map((item) => [item.id_producto, Number(item.stock_total)])
  );

  const form = useForm<SaleFormInput, unknown, SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      id_cliente: "",
      fecha_venta: toDateTimeLocalString(new Date()),
      estado: "Cerrada",
      detalles: [
        {
          id_producto: "",
          cantidad: 1,
          precio_unitario: "",
          descuento_unitario: 0,
        },
      ],
    },
  });

  const details = useWatch({ control: form.control, name: "detalles" }) || [];
  const currentStatus = useWatch({ control: form.control, name: "estado" });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "detalles",
  });

  const estimatedTotal = details.reduce((sum, detail) => {
    const product = activeProducts.find((item) => item.id_producto === detail.id_producto);
    const basePrice =
      detail.precio_unitario === "" || detail.precio_unitario === undefined
        ? Number(product?.precio_base_venta || 0)
        : Number(detail.precio_unitario);
    const quantity = Number(detail.cantidad || 0);
    const discount = Number(detail.descuento_unitario || 0);
    const lineTotal = Math.max(basePrice - discount, 0) * quantity;
    return sum + lineTotal;
  }, 0);

  const onSubmit = async (data: SaleFormData) => {
    try {
      if (data.estado === "Cerrada") {
        const requestedByProduct = new Map<string, number>();

        for (const detail of data.detalles) {
          const requested = Number(detail.cantidad);
          const current = requestedByProduct.get(detail.id_producto) || 0;
          requestedByProduct.set(detail.id_producto, current + requested);
        }

        for (const [productId, requested] of requestedByProduct.entries()) {
          const available = stockByProduct.get(productId) || 0;
          const product = activeProducts.find((item) => item.id_producto === productId);

          if (requested > available) {
            throw new Error(
              `No hay stock suficiente para ${product?.nombre || "el producto seleccionado"}.`
            );
          }
        }
      }

      await toast.promise(createSaleMutation.mutateAsync(data), {
        loading: "Registrando venta...",
        success: "Venta registrada correctamente",
        error: (error) =>
          error instanceof Error ? error.message : "No se pudo registrar la venta",
        position: "top-right",
      });

      form.reset({
        id_cliente: "",
        fecha_venta: toDateTimeLocalString(new Date()),
        estado: "Cerrada",
        detalles: [
          {
            id_producto: "",
            cantidad: 1,
            precio_unitario: "",
            descuento_unitario: 0,
          },
        ],
      });
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo registrar la venta",
        { position: "top-right" }
      );
    }
  };

  return (
    <form id="form-sale" className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet className="w-full">
        <FieldGroup className="gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Controller
              name="id_cliente"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Cliente</FieldLabel>
                  <Select value={field.value || "none"} onValueChange={(value) => field.onChange(value === "none" ? "" : value)}>
                    <SelectTrigger className="h-9" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Venta sin cliente</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id_cliente} value={client.id_cliente}>
                          {client.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
            <Controller
              name="fecha_venta"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sale-date">Fecha de venta</FieldLabel>
                  <Input
                    {...field}
                    id="sale-date"
                    type="datetime-local"
                    className="h-9"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
            <Controller
              name="estado"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Estado inicial</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cerrada">Cerrada</SelectItem>
                      <SelectItem value="Abierta">Abierta</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold">Detalle de la venta</h3>
                <p className="text-sm text-muted-foreground">
                  Selecciona los productos, define cantidades y ajusta precio o descuento si es necesario.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    id_producto: "",
                    cantidad: 1,
                    precio_unitario: "",
                    descuento_unitario: 0,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar producto
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((item, index) => {
                const selectedProduct = activeProducts.find(
                  (product) => product.id_producto === details[index]?.id_producto
                );
                const stock = selectedProduct
                  ? stockByProduct.get(selectedProduct.id_producto) || 0
                  : 0;

                return (
                  <div key={item.id} className="rounded-xl border bg-background p-4">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">Producto #{index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedProduct
                            ? `Stock disponible: ${stock.toLocaleString("es-CO")} unidades`
                            : "Selecciona un producto del catalogo"}
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

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <Controller
                        name={`detalles.${index}.id_producto`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Producto</FieldLabel>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                const product = activeProducts.find(
                                  (item) => item.id_producto === value
                                );
                                if (product) {
                                  form.setValue(
                                    `detalles.${index}.precio_unitario`,
                                    Number(product.precio_base_venta)
                                  );
                                } else {
                                  form.setValue(`detalles.${index}.precio_unitario`, "");
                                }
                              }}
                            >
                              <SelectTrigger className="h-9" aria-invalid={fieldState.invalid}>
                                <SelectValue placeholder="Selecciona un producto" />
                              </SelectTrigger>
                              <SelectContent>
                                {activeProducts.map((product) => (
                                  <SelectItem key={product.id_producto} value={product.id_producto}>
                                    {product.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                          </Field>
                        )}
                      />

                      <Controller
                        name={`detalles.${index}.cantidad`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`sale-quantity-${index}`}>Cantidad</FieldLabel>
                            <Input
                              id={`sale-quantity-${index}`}
                              type="number"
                              min="1"
                              step="1"
                              className="h-9"
                              value={
                                typeof field.value === "number" ||
                                typeof field.value === "string"
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
                        name={`detalles.${index}.precio_unitario`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`sale-price-${index}`}>Precio unitario</FieldLabel>
                            <Input
                              id={`sale-price-${index}`}
                              type="number"
                              min="0"
                              step="0.01"
                              className="h-9"
                              placeholder={
                                selectedProduct
                                  ? `Base: ${selectedProduct.precio_base_venta}`
                                  : "Usar precio base"
                              }
                              value={
                                typeof field.value === "number" ||
                                typeof field.value === "string"
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
                        name={`detalles.${index}.descuento_unitario`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`sale-discount-${index}`}>Descuento unitario</FieldLabel>
                            <Input
                              id={`sale-discount-${index}`}
                              type="number"
                              min="0"
                              step="0.01"
                              className="h-9"
                              value={
                                typeof field.value === "number" ||
                                typeof field.value === "string"
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total estimado</p>
                <h3 className="text-2xl font-semibold tracking-tight">
                  {formatCurrency(estimatedTotal)}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentStatus === "Cerrada"
                  ? "La venta impactara el inventario al guardarse."
                  : "La venta se guardara abierta y podra cerrarse despues."}
              </p>
            </div>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
