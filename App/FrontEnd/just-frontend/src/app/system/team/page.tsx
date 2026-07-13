"use client";

import { Crown, Mail, Network, ShieldCheck, UsersRound } from "lucide-react";
import { EmptyGlobal } from "@/shared/components/empty-global";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useDistributorChildrenQuery } from "@/features/profile/hooks/useDistributorChildrenQuery";
import { useProfileQuery } from "@/features/profile/hooks/useProfileQuery";
import { getIndicatorClass, getStateIndicatorClass } from "@/shared/lib/status-indicators";

function formatDate(date?: string | null) {
  if (!date) return "Sin registrar";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function getInitials(name?: string) {
  if (!name) return "JU";

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "JU";
}

function canManageTeam(role?: string) {
  return role === "Lider" || role === "Lider de Grupo";
}

export default function TeamPage() {
  const { data: profile, isLoading: isProfileLoading } = useProfileQuery();
  const canSeeTeam = canManageTeam(profile?.rol);
  const {
    data: children = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useDistributorChildrenQuery(Boolean(profile && canSeeTeam));

  if (isProfileLoading || isLoading) {
    return (
      <div className="m-4 space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!canSeeTeam) {
    return (
      <div className="m-4">
        <EmptyGlobal
          icon={<Network className="h-12 w-12" />}
          title="Equipo no disponible"
          description="Esta vista esta disponible para Lideres y Lideres de Grupo con personas vinculadas."
          className="border border-dashed"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="m-4">
        <EmptyGlobal
          icon={<UsersRound className="h-12 w-12" />}
          title="No pudimos cargar tu equipo"
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

  return (
    <div className="m-4 space-y-4">
      <section className="rounded-[28px] border bg-background p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-700 dark:text-sky-300">Equipo directo</p>
            <h1 className="text-2xl font-bold tracking-tight">Personas vinculadas</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Consulta los datos principales de las distribuidoras asociadas directamente a tu perfil.
            </p>
          </div>
          <Badge variant="outline" className={getIndicatorClass("info")}>
            <UsersRound className="mr-1 h-3.5 w-3.5" />
            {children.length} vinculadas
          </Badge>
        </div>
      </section>

      {children.length === 0 ? (
        <EmptyGlobal
          icon={<UsersRound className="h-12 w-12" />}
          title="Aun no tienes personas vinculadas"
          description="Cuando una distribuidora use tu codigo de referido vigente, aparecera en esta vista."
          className="border border-dashed"
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {children.map((child) => (
            <article
              key={child.id_distribuidor}
              className="rounded-2xl border bg-background p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={child.foto_avatar?.trim() || undefined} alt={child.nombre} />
                  <AvatarFallback>{getInitials(child.nombre)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold">{child.nombre}</h2>
                  <p className="truncate text-sm text-muted-foreground">{child.usuario.correo}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className={getIndicatorClass("info")}>
                  <Crown className="mr-1 h-3.5 w-3.5" />
                  {child.rol}
                </Badge>
                <Badge variant="outline" className={getStateIndicatorClass(child.estado)}>
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  {child.estado}
                </Badge>
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{child.usuario.correo}</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Vinculada desde
                  </p>
                  <p className="mt-1 font-medium">{formatDate(child.createdAt)}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
