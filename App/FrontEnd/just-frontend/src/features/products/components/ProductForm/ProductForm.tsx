

"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/shared/components/ui/input";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/shared/components/ui/field"
import { ProductSchema } from "../../validations/ProductSchema";
import { ProductFormData } from "../../validations/ProductSchema";
import useProductServices from "../../services/productServices";
import { useDialogStore } from "@/store/use-dialog-store";

export default function ProductForm() {
    const productSrv = useProductServices();
    const closeDialog = useDialogStore((state) => state.closeDialog);

    const form = useForm({
        resolver: zodResolver(
            ProductSchema
        ),
        defaultValues: {
            nombre: "",
            descripcion: "",
            codigo: "",
            precio_compra: 0,
            precio_venta: 0,
            foto_avatar: "",
        },
    });

    const onSubmit = async (data: ProductFormData) => {
        try {
            const response = await toast.promise(productSrv.createProduct(data), {
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
                    <Controller
                        name="descripcion"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="description">Descripción</FieldLabel>
                                <Input {...field} id="description" type="text" aria-invalid={fieldState.invalid} placeholder="Descripción" className="w-full h-9" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
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
                    <Controller
                        name="foto_avatar"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="avatarImage">Foto de Perfil</FieldLabel>
                                <Input {...field} id="avatarImage" type="text" aria-invalid={fieldState.invalid} placeholder="Foto de Perfil" className="w-full h-9" />
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
