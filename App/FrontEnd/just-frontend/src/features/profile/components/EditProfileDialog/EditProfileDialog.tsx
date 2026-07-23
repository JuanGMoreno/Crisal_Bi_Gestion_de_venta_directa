"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { DistributorProfile } from "@/features/profile/types/Profile";
import { ProfileFormData, ProfileFormInput, profileSchema } from "@/features/profile/validations/profileSchema";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { useUpdateProfileMutation } from "../../hooks/useUpdateProfileMutation";
import { BRAND } from "@/shared/config/brand";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: DistributorProfile;
}

const DEFAULT_PROFILE_PREVIEW = BRAND.logo;

function getProfileInitials(name?: string) {
  if (!name) return "CR";

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "CR";
}

function getDefaultValues(profile: DistributorProfile): ProfileFormInput {
  return {
    nombre: profile.nombre || "",
    foto_avatar: profile.foto_avatar || "",
  };
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
}: EditProfileDialogProps) {
  const updateProfileMutation = useUpdateProfileMutation();
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormInput, unknown, ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: getDefaultValues(profile),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(profile));
    }
  }, [form, open, profile]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const nameValue = useWatch({ control: form.control, name: "nombre" });
  const photoValue = useWatch({ control: form.control, name: "foto_avatar" });
  const previewSrc =
    localPreviewUrl || (photoValue?.trim() ? photoValue : profile.foto_avatar || DEFAULT_PROFILE_PREVIEW);

  const onSubmit = async (data: ProfileFormData) => {
    const formData = new FormData();
    formData.append("nombre", data.nombre.trim());

    if (selectedPhotoFile) {
      formData.append("foto_avatar", selectedPhotoFile);
    } else if (data.foto_avatar?.trim()) {
      formData.append("foto_avatar", data.foto_avatar.trim());
    } else {
      formData.append("foto_avatar", "");
    }

    try {
      await toast.promise(updateProfileMutation.mutateAsync(formData), {
        loading: "Actualizando perfil...",
        success: "Perfil actualizado correctamente",
        error: (error) =>
          error instanceof Error ? error.message : "No se pudo actualizar tu perfil",
        position: "top-right",
      });

      onOpenChange(false);
    } catch {
      // El toast.promise ya muestra el mensaje de error.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Actualiza la informacion visible de tu perfil como distribuidor.
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-profile"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-background to-blue-50 p-5 text-center dark:border-sky-900/40 dark:from-sky-950/20 dark:via-background dark:to-blue-950/20">
              <Avatar className="h-20 w-20 border-4 border-background shadow-sm ring-1 ring-sky-200 dark:ring-sky-900/70">
                <AvatarImage src={previewSrc} alt={nameValue || "Distribuidor"} />
                <AvatarFallback className="bg-sky-100 text-lg font-semibold text-sky-800 dark:bg-sky-950/40 dark:text-sky-100">
                  {getProfileInitials(nameValue)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{nameValue?.trim() || "Tu perfil"}</p>
                <p className="text-sm text-muted-foreground">
                  Cambia tu nombre visible y tu foto de perfil.
                </p>
              </div>
            </div>

            <Controller
              name="foto_avatar"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="profile-avatar">Foto de perfil</FieldLabel>
                  <Input
                    id="profile-avatar"
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
                        field.onChange(profile.foto_avatar || "");
                        return;
                      }

                      setSelectedPhotoFile(selectedFile);
                      const objectUrl = URL.createObjectURL(selectedFile);
                      setLocalPreviewUrl(objectUrl);
                      field.onChange(selectedFile.name);
                    }}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Si no seleccionas una nueva imagen, se mantendra la foto actual.
                  </p>
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
          </div>

          <FieldSet className="w-full">
            <FieldGroup className="gap-4">
              <Controller
                name="nombre"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="profile-name">Nombre visible</FieldLabel>
                    <Input
                      {...field}
                      id="profile-name"
                      className="h-9"
                      placeholder="Nombre del distribuidor"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="profile-email">Correo</FieldLabel>
                  <Input
                    id="profile-email"
                    value={profile.usuario.correo}
                    className="h-9"
                    disabled
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="profile-role">Rol</FieldLabel>
                  <Input
                    id="profile-role"
                    value={profile.rol}
                    className="h-9"
                    disabled
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="form-profile" disabled={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
