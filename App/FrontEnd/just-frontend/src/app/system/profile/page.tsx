"use client";

import { useEffect, useState } from "react";
import {
  Crown,
  GitBranchPlus,
  LogOut,
  PencilLine,
  ShieldCheck,
  Sparkles,
  Ticket,
  UsersRound,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditProfileDialog } from "@/features/profile/components/EditProfileDialog/EditProfileDialog";
import { ProfileSkeleton } from "@/features/profile/components/ProfileSkeleton/ProfileSkeleton";
import { useProfileQuery } from "@/features/profile/hooks/useProfileQuery";
import { useRenewReferralCodeMutation } from "@/features/profile/hooks/useRenewReferralCodeMutation";
import useAuthServices from "@/features/auth/services/authServices";
import { EmptyGlobal } from "@/shared/components/empty-global";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { getIndicatorClass, getStateIndicatorClass } from "@/shared/lib/status-indicators";

function formatDate(date?: string | null) {
  if (!date) {
    return "Sin registrar";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function formatDateTime(date?: string | null) {
  if (!date) {
    return "Sin registrar";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getProfileInitials(name?: string) {
  if (!name) return "JU";

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "JU";
}

function isReferralCodeExpired(date?: string | null) {
  if (!date) return true;
  return new Date(date).getTime() <= Date.now();
}

export default function PageProfile() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: profile, isLoading, isError, error, refetch, isFetching } = useProfileQuery();
  const renewReferralCodeMutation = useRenewReferralCodeMutation();
  const { Signout } = useAuthServices();
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
    return (
      <div className="m-4">
        <ProfileSkeleton />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="m-4">
        <EmptyGlobal
          icon={<UsersRound className="h-12 w-12" />}
          title="No pudimos cargar tu perfil"
          description={error instanceof Error ? error.message : "Ocurrio un error inesperado."}
          buttonText="Reintentar"
          onButtonClick={() => {
            void refetch();
          }}
          className="border border-dashed"
        />
      </div>
    );
  }

  const accountIsActive = profile.estado === "Activo" && profile.usuario.estado === "Activo";
  const referralCodeExpired = isReferralCodeExpired(profile.fecha_vencimiento_codigo);

  const handleRenewReferralCode = async () => {
    try {
      await toast.promise(renewReferralCodeMutation.mutateAsync(), {
        loading: "Solicitando nuevo codigo...",
        success: "Nuevo codigo de referido generado correctamente",
        error: (renewError) =>
          renewError instanceof Error
            ? renewError.message
            : "No se pudo solicitar un nuevo codigo de referido",
        position: "top-right",
      });
    } catch {
      // El toast.promise ya maneja el feedback.
    }
  };

  const handleSignout = async () => {
    try {
      await toast.promise(Signout(), {
        loading: "Cerrando sesion...",
        success: "Sesion cerrada correctamente",
        error: (signoutError) =>
          signoutError instanceof Error ? signoutError.message : "No se pudo cerrar sesion",
        position: "top-right",
      });

      await queryClient.clear();
      router.replace("/auth/signin");
    } catch {
      // El toast.promise ya muestra el error.
    }
  };

  return (
    <div className="m-4 space-y-4">
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-50 via-background to-blue-50 p-6 shadow-sm dark:border-sky-900/40 dark:from-sky-950/20 dark:via-background dark:to-blue-950/20">
        <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-500/10" />

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
                <p className="text-sm font-medium text-sky-700 dark:text-sky-300">
                  Perfil del distribuidor
                </p>
                <h1 className="text-3xl font-bold tracking-tight">{profile.nombre}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Gestiona tu informacion principal, tu codigo de referido y tu relacion jerarquica
                  dentro del sistema.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getIndicatorClass("info")}>
                  <Crown className="mr-1 h-3.5 w-3.5" />
                  {profile.rol}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    accountIsActive
                      ? getStateIndicatorClass("Activo")
                      : getStateIndicatorClass("Inactivo")
                  }
                >
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Cuenta {accountIsActive ? "activa" : "inactiva"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row xl:self-start">
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(true)}>
              <PencilLine className="mr-2 h-4 w-4" />
              Editar perfil
            </Button>
            <Button type="button" variant="outline" onClick={() => void handleSignout()} className={`${getIndicatorClass("bad")} hover:text-rose600`}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesion
            </Button>
          </div>
        </div>
      </section>

      {isFetching ? (
        <div className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          Actualizando perfil...
        </div>
      ) : null}

      <section className="rounded-[28px] border bg-background p-5 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold tracking-tight">Informacion general</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Los datos basicos de tu perfil y el estado actual de tu cuenta.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Correo</p>
                <p className="mt-1 font-medium">{profile.usuario.correo}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Rol</p>
                <p className="mt-1 font-medium">{profile.rol}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cuenta creada</p>
                <p className="mt-1 font-medium">{formatDate(profile.usuario.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Ultima actualizacion</p>
                <p className="mt-1 font-medium">{formatDateTime(profile.updatedAt)}</p>
              </div>
            </div>
          </div>

          <div className="w-full rounded-2xl border p-4 xl:max-w-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Codigo de referido
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {profile.codigo_referido || "Sin codigo asignado"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {referralCodeExpired
                    ? "Tu codigo actual ya vencio."
                    : `Vigente hasta ${formatDate(profile.fecha_vencimiento_codigo)}`}
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  referralCodeExpired
                    ? getIndicatorClass("warning")
                    : getIndicatorClass("good")
                }
              >
                <Ticket className="mr-1 h-3.5 w-3.5" />
                {referralCodeExpired ? "Vencido" : "Vigente"}
              </Badge>
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={() => {
                void handleRenewReferralCode();
              }}
              disabled={!referralCodeExpired || renewReferralCodeMutation.isPending}
            >
              <GitBranchPlus className="mr-2 h-4 w-4" />
              {renewReferralCodeMutation.isPending
                ? "Solicitando codigo..."
                : "Solicitar nuevo codigo"}
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border bg-background p-5 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight">Distribuidor padre</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          La referencia jerarquica asociada a tu cuenta y el codigo vinculado a esa relacion.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Nombre del distribuidor padre
            </p>
            <p className="mt-1 font-medium">
              {profile.padre?.nombre || "Sin distribuidor padre asignado"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Rol del distribuidor padre
            </p>
            <p className="mt-1 font-medium">{profile.padre?.rol || "Sin registrar"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Codigo del distribuidor padre
            </p>
            <p className="mt-1 font-medium">
              {profile.padre?.codigo_referido || "Sin codigo registrado"}
            </p>
          </div>
        </div>

        {!profile.padre ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Tu cuenta no tiene una relacion jerarquica registrada actualmente.
          </p>
        ) : null}
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
