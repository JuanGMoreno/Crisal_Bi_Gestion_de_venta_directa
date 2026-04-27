"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { useCreateClientMutation, useUpdateClientMutation } from "../../hooks/useClientMutations";
import { Client } from "../../types/Client";
import { ClientFormData, ClientFormInput, clientSchema } from "../../validations/ClientSchema";

interface ClientFormProps {
  mode?: "create" | "edit";
  clientId?: string;
  initialClient?: Client | null;
  onSuccess?: () => void;
}

const DEFAULT_CLIENT_PREVIEW = "/Logo_Just.svg";

function getDefaultClientValues(): ClientFormInput {
  return {
    nombre: "",
    cedula: "",
    direccion: "",
    edad: "",
    numero_telefono: "",
    foto_avatar: "",
    estado: "Activo",
  };
}

function mapClientToFormValues(client: Client): ClientFormInput {
  return {
    nombre: client.nombre || "",
    cedula: client.cedula || "",
    direccion: client.direccion || "",
    edad: client.edad ?? "",
    numero_telefono: client.numero_telefono || "",
    foto_avatar: client.foto_avatar || "",
    estado: "Activo",
  };
}

function getClientInitials(name?: string) {
  if (!name) return "CL";

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "CL";
}

export function ClientForm({
  mode = "create",
  clientId,
  initialClient,
  onSuccess,
}: ClientFormProps) {
  const createClientMutation = useCreateClientMutation();
  const updateClientMutation = useUpdateClientMutation();
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  const form = useForm<ClientFormInput, unknown, ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: getDefaultClientValues(),
  });

  useEffect(() => {
    if (mode === "edit" && initialClient) {
      form.reset(mapClientToFormValues(initialClient));
      return;
    }

    if (mode === "create") {
      form.reset(getDefaultClientValues());
    }
  }, [form, initialClient, mode]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const avatarValue = useWatch({ control: form.control, name: "foto_avatar" });
  const nameValue = useWatch({ control: form.control, name: "nombre" });

  const onSubmit = async (data: ClientFormData) => {
    const formData = new FormData();
    formData.append("nombre", data.nombre.trim());
    formData.append("cedula", data.cedula.trim());
    formData.append("estado", "Activo");

    if (data.direccion?.trim()) {
      formData.append("direccion", data.direccion.trim());
    }

    if (data.numero_telefono?.trim()) {
      formData.append("numero_telefono", data.numero_telefono.trim());
    }

    if (data.edad !== "") {
      formData.append("edad", String(Number(data.edad)));
    }

    if (selectedPhotoFile) {
      formData.append("foto_avatar", selectedPhotoFile);
    } else if (data.foto_avatar?.trim()) {
      formData.append("foto_avatar", data.foto_avatar.trim());
    }

    try {
      const submitAction =
        mode === "edit" && clientId
          ? updateClientMutation.mutateAsync({ id: clientId, data: formData })
          : createClientMutation.mutateAsync(formData);

      await toast.promise(submitAction, {
        loading: mode === "edit" ? "Actualizando cliente..." : "Registrando cliente...",
        success:
          mode === "edit" ? "Cliente actualizado correctamente" : "Cliente creado correctamente",
        error: (error) =>
          error instanceof Error
            ? error.message
            : mode === "edit"
              ? "No se pudo actualizar el cliente"
              : "No se pudo registrar el cliente",
        position: "top-right",
      });

      if (mode === "create") {
        form.reset(getDefaultClientValues());
        setSelectedPhotoFile(null);
        setLocalPreviewUrl(null);
      }

      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : mode === "edit"
            ? "No se pudo actualizar el cliente"
            : "No se pudo registrar el cliente",
        { position: "top-right" }
      );
    }
  };

  const previewSrc = localPreviewUrl || (avatarValue?.trim() ? avatarValue : DEFAULT_CLIENT_PREVIEW);

  return (
    <form id="form-client" className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-background to-blue-50 p-5 text-center dark:border-sky-900/40 dark:from-sky-950/20 dark:via-background dark:to-blue-950/20">
        <Avatar className="h-20 w-20 border-4 border-background shadow-sm ring-1 ring-sky-200 dark:ring-sky-900/70">
          <AvatarImage src={previewSrc} alt={nameValue || "Cliente"} />
          <AvatarFallback className="bg-sky-100 text-lg font-semibold text-sky-800 dark:bg-sky-950/40 dark:text-sky-100">
            {getClientInitials(nameValue)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{nameValue?.trim() || "Nuevo cliente"}</p>
        </div>
      </div>

      <FieldSet className="w-full">
        <FieldGroup className="gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              name="nombre"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="client-name">Nombre completo</FieldLabel>
                  <Input
                    {...field}
                    id="client-name"
                    className="h-9"
                    placeholder="Nombre del cliente"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />

            <Controller
              name="cedula"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="client-document">Cedula</FieldLabel>
                  <Input
                    {...field}
                    id="client-document"
                    className="h-9"
                    placeholder="Documento de identidad"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Controller
              name="edad"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="client-age">Edad</FieldLabel>
                  <Input
                    id="client-age"
                    type="number"
                    min="0"
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
              name="numero_telefono"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="client-phone">Telefono</FieldLabel>
                  <Input
                    {...field}
                    id="client-phone"
                    className="h-9"
                    placeholder="Numero de contacto"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />

            <Controller
              name="foto_avatar"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="client-avatar">Foto del cliente</FieldLabel>
                  <Input
                    id="client-avatar"
                    type="file"
                    accept="image/*"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                    className="h-9"
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0] ?? null;

                      if (localPreviewUrl) {
                        URL.revokeObjectURL(localPreviewUrl);
                      }

                      if (!selectedFile) {
                        setSelectedPhotoFile(null);
                        setLocalPreviewUrl(null);
                        field.onChange(initialClient?.foto_avatar || "");
                        return;
                      }

                      setSelectedPhotoFile(selectedFile);
                      const objectUrl = URL.createObjectURL(selectedFile);
                      setLocalPreviewUrl(objectUrl);
                      field.onChange(selectedFile.name);
                    }}
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
          </div>

          <Controller
            name="direccion"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="client-address">Direccion</FieldLabel>
                <Input
                  {...field}
                  id="client-address"
                  placeholder="Direccion o referencia de ubicacion"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
