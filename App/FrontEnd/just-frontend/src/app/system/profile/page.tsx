"use client";

import { useEffect, useState } from "react";
import { LogOut, PencilLine, ShieldCheck, Sparkles, Store, UsersRound } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditProfileDialog } from "@/features/profile/components/EditProfileDialog/EditProfileDialog";
import { ProfileSkeleton } from "@/features/profile/components/ProfileSkeleton/ProfileSkeleton";
import { useProfileQuery } from "@/features/profile/hooks/useProfileQuery";
import useAuthServices from "@/features/auth/services/authServices";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { EmptyGlobal } from "@/shared/components/empty-global";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { getIndicatorClass, getStateIndicatorClass } from "@/shared/lib/status-indicators";

function formatDate(date?: string | null) {
  if (!date) return "Sin registrar";
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(date));
}

function formatDateTime(date?: string | null) {
  if (!date) return "Sin registrar";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getProfileInitials(name?: string) {
  if (!name) return "CR";
  return name.trim().split(/\s+/).slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "").join("") || "CR";
}

export default function PageProfile() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: profile, isLoading, isError, error, refetch, isFetching } = useProfileQuery();
  const { Signout } = useAuthServices();
  const { clearSession } = useAuthSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      toast.error(error instanceof Error ? error.message : "Error al cargar tu perfil", {
        position: "top-right",
      });
    }
  }, [isError, error]);

  if (isLoading) {
    return <div className="m-4"><ProfileSkeleton /></div>;
  }

  if (isError || !profile) {
    return (
      <div className="m-4">
        <EmptyGlobal
          icon={<UsersRound className="h-12 w-12" />}
          title="No pudimos cargar tu perfil"
          description={error instanceof Error ? error.message : "Ocurrió un error inesperado."}
          buttonText="Reintentar"
          onButtonClick={() => void refetch()}
          className="border border-dashed"
        />
      </div>
    );
  }

  const accountIsActive = profile.estado === "Activo" && profile.usuario.estado === "Activo";

  const handleSignout = async () => {
    try {
      await toast.promise(Signout(), {
        loading: "Cerrando sesión...",
        success: "Sesión cerrada correctamente",
        error: (signoutError) =>
          signoutError instanceof Error ? signoutError.message : "No se pudo cerrar sesión",
        position: "top-right",
      });
      clearSession();
      queryClient.clear();
      router.replace("/auth/signin");
    } catch {
      // El toast.promise ya muestra el error.
    }
  };

  return (
    <div className="m-4 space-y-4">
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-50 via-background to-blue-50 p-6 shadow-sm dark:border-sky-900/40 dark:from-sky-950/20 dark:via-background dark:to-blue-950/20">
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <Avatar className="h-24 w-24 border-4 border-background shadow-sm ring-1 ring-sky-200 dark:ring-sky-900/60">
              <AvatarImage src={profile.foto_avatar?.trim() || undefined} alt={profile.nombre} />
              <AvatarFallback className="bg-sky-100 text-2xl font-semibold text-sky-800 dark:bg-sky-950/40 dark:text-sky-100">
                {getProfileInitials(profile.nombre)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-sky-700 dark:text-sky-300">Perfil del negocio</p>
                <h1 className="text-3xl font-bold tracking-tight">{profile.nombre}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Gestiona la identidad y los datos principales de tu operación comercial.
                </p>
              </div>
              <Badge variant="outline" className={accountIsActive
                ? getStateIndicatorClass("Activo")
                : getStateIndicatorClass("Inactivo")}
              >
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Cuenta {accountIsActive ? "activa" : "inactiva"}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row xl:self-start">
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(true)}>
              <PencilLine className="mr-2 h-4 w-4" />Editar perfil
            </Button>
            <Button type="button" variant="outline" onClick={() => void handleSignout()}
              className={`${getIndicatorClass("bad")} hover:text-rose-600`}>
              <LogOut className="mr-2 h-4 w-4" />Cerrar sesión
            </Button>
          </div>
        </div>
      </section>

      {isFetching ? (
        <div className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />Actualizando perfil...
        </div>
      ) : null}

      <section className="rounded-[28px] border bg-background p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-sky-700 dark:text-sky-300" />
          <h2 className="text-xl font-semibold tracking-tight">Información general</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Datos básicos de la cuenta independiente que administra productos, inventario, clientes y ventas.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Correo</p>
            <p className="mt-1 font-medium">{profile.usuario.correo}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Estado</p>
            <p className="mt-1 font-medium">{accountIsActive ? "Activo" : "Inactivo"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Cuenta creada</p>
            <p className="mt-1 font-medium">{formatDate(profile.usuario.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Última actualización</p>
            <p className="mt-1 font-medium">{formatDateTime(profile.updatedAt)}</p>
          </div>
        </div>
      </section>

      <EditProfileDialog
        key={`${profile.id_distribuidor}-${isEditDialogOpen ? "open" : "closed"}-${profile.updatedAt}`}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        profile={profile}
      />
    </div>
  );
}
