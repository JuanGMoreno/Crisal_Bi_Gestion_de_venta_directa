

"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/shared/components/ui/field"
import { ProductSchema } from "../../validations/ProductSchema";
import { ProductFormData } from "../../validations/ProductSchema";
import { useDialogStore } from "@/store/use-dialog-store";
import { useCreateProductMutation } from "../../hooks/useProductMutations";
import { useUpdateProductMutation } from "../../hooks/useProductMutations";

type ProductFormProps = {
    initialData?: Partial<ProductFormData>;
    type?: "createProduct" | "editProduct";
    productId?: string;
};

const DEFAULT_PREVIEW_IMAGE = "/Logo_Just.svg";

export default function ProductForm({
    initialData,
    type = "createProduct",
    productId,
}: ProductFormProps) {
    const createProductMutation = useCreateProductMutation();
    const updateProductMutation = useUpdateProductMutation();
    const closeDialog = useDialogStore((state) => state.closeDialog);
    const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);


    const form = useForm({
        resolver: zodResolver(
            ProductSchema
        ),
        defaultValues: {
            nombre: initialData?.nombre || "",
            descripcion: initialData?.descripcion || "",
            codigo: initialData?.codigo || "",
            precio_compra: initialData?.precio_compra || 0,
            precio_venta: initialData?.precio_venta || 0,
            foto_avatar: "",
            estado: initialData?.estado || "Activo",
        },
    });

    useEffect(() => {
        form.reset({
            nombre: initialData?.nombre || "",
            descripcion: initialData?.descripcion || "",
            codigo: initialData?.codigo || "",
            precio_compra: initialData?.precio_compra || 0,
            precio_venta: initialData?.precio_venta || 0,
            foto_avatar: initialData?.foto_avatar || "",
            estado: initialData?.estado || "Activo",
        });
    }, [initialData, form]);

    useEffect(() => {
        return () => {
            if (localPreviewUrl) {
                URL.revokeObjectURL(localPreviewUrl);
            }
        }
    }, [localPreviewUrl]);

    const onSubmit = async (data: ProductFormData) => {
        const formData = new FormData();
        formData.append("nombre", data.nombre);
        formData.append("descripcion", data.descripcion);
        formData.append("codigo", data.codigo);
        formData.append("precio_compra", String(data.precio_compra));
        formData.append("precio_venta", String(data.precio_venta));
        formData.append("estado", data.estado);

        if (selectedPhotoFile) {
            formData.append("foto_avatar", selectedPhotoFile);
        } else if (data.foto_avatar) {
            formData.append("foto_avatar", data.foto_avatar);
        }

        if (type === "editProduct") {
            if (!productId) {
                toast.error("No se encontro el id del producto para editar", { position: "top-right" });
                return;
            }

            try {
                // mutateAsync permite usar el flujo async/await sin perder React Query.
                const response = await toast.promise(updateProductMutation.mutateAsync({ id: productId, data: formData }), {
                    loading: "Actualizando producto...",
                    success: "Producto actualizado correctamente",
                    error: (error) => (error instanceof Error ? error.message : "Error al actualizar producto"),
                    position: "top-right",
                });
                console.log("Producto actualizado:", response);
                form.reset();
                closeDialog();
            } catch (error) {
                console.error("Error al actualizar producto:", error);
            }

        } else {
            try {
                // mutateAsync permite usar el flujo async/await sin perder React Query.
                const response = await toast.promise(createProductMutation.mutateAsync(formData), {
                    loading: "Creando producto...",
                    success: "Producto creado correctamente",
                    error: (error) => (error instanceof Error ? error.message : "Error al crear producto"),
                    position: "top-right",
                });
                console.log("Producto creado:", response);
                form.reset();
                closeDialog();
            } catch (error) {
                console.error("Error al crear producto:", error);
            }
        }
    };

    const fotoValue = useWatch({ control: form.control, name: "foto_avatar" });
    const previewSrc = localPreviewUrl || (fotoValue?.trim() ? fotoValue : DEFAULT_PREVIEW_IMAGE);

    return (
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} id="form-product">
            <FieldSet className="w-full">
                <FieldGroup className="gap-3">
                    <Controller
                        name="nombre"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="name">Nombre</FieldLabel>
                                <Input {...field} id="name" type="text" aria-invalid={fieldState.invalid} placeholder="Nombre" className="w-full h-9" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <div className="flex justify-between gap-4">
                        <Controller
                            name="codigo"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="code">Código</FieldLabel>
                                    <Input {...field} id="code" type="text" aria-invalid={fieldState.invalid} placeholder="Código" className="w-full h-9" />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="precio_compra"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="purchasePrice">Precio de Compra</FieldLabel>
                                    <Input
                                        id="purchasePrice"
                                        type="number"
                                        step="any"
                                        name={field.name}
                                        ref={field.ref}
                                        value={typeof field.value === "number" ? field.value : field.value ? String(field.value) : ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        onBlur={field.onBlur}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Precio de Compra"
                                        className="w-full h-9"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="precio_venta"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="salePrice">Precio de Venta</FieldLabel>
                                    <Input
                                        id="salePrice"
                                        type="number"
                                        step="any"
                                        name={field.name}
                                        ref={field.ref}
                                        value={typeof field.value === "number" ? field.value : field.value ? String(field.value) : ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        onBlur={field.onBlur}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Precio de Venta"
                                        className="w-full h-9"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                    <Controller
                        name="descripcion"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="description">Descripción</FieldLabel>
                                <Textarea {...field} id="description" aria-invalid={fieldState.invalid} placeholder="Descripción" className="w-full h-20" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="foto_avatar"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="avatarImage">Foto de Perfil</FieldLabel>
                                <Input
                                    name={field.name}
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    id="avatarImage"
                                    type="file"
                                    accept="image/*"
                                    aria-invalid={fieldState.invalid}
                                    className="w-full h-9"
                                    onChange={(event) => {
                                        const selectedFile = event.target.files?.[0] ?? null;

                                        if (localPreviewUrl) {
                                            URL.revokeObjectURL(localPreviewUrl);
                                        }

                                        if (!selectedFile) {
                                            setSelectedPhotoFile(null);
                                            setLocalPreviewUrl(null);
                                            field.onChange(initialData?.foto_avatar || "");
                                            return;
                                        }

                                        setSelectedPhotoFile(selectedFile);
                                        const objectUrl = URL.createObjectURL(selectedFile);
                                        setLocalPreviewUrl(objectUrl);
                                        field.onChange(selectedFile.name);
                                    }}
                                />
                                <div className="mt-2 flex items-center gap-3 rounded-md border bg-muted/30 p-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={previewSrc}
                                        alt="Vista previa de la foto del producto"
                                        className="h-12 w-12 rounded-md border object-cover"
                                        onError={(event) => {
                                            event.currentTarget.onerror = null
                                            event.currentTarget.src = DEFAULT_PREVIEW_IMAGE
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Vista previa de la foto del producto. Si no seleccionas una nueva imagen, se mantendrá la actual o se mostrará la imagen por defecto.
                                    </p>
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </FieldSet>
        </form>
    )
}
