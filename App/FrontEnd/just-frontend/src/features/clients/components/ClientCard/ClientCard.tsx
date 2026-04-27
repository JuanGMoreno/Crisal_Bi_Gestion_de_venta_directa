"use client";

import { MapPin, MoreHorizontal, Pencil, Phone, ShieldCheck, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  destructiveMenuItemClass,
  getStateIndicatorClass,
} from "@/shared/lib/status-indicators";
import { Client } from "../../types/Client";

interface ClientCardProps {
  client: Client;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

function getClientInitials(name?: string) {
  if (!name) return "CL";

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "CL";
}

function MetaRow({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="text-sky-700 dark:text-sky-300">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

export function ClientCard({ client, onView, onEdit, onDelete }: ClientCardProps) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-sky-100 bg-gradient-to-br from-sky-50 via-background to-blue-50 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md dark:border-sky-900/40 dark:from-sky-950/20 dark:via-background dark:to-blue-950/20">
      <div className="flex items-start justify-between gap-4 border-b border-sky-100/80 p-5 dark:border-sky-900/40">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-background shadow-sm ring-1 ring-sky-200 dark:ring-sky-900/70">
            <AvatarImage src={client.foto_avatar?.trim() || undefined} alt={client.nombre} />
            <AvatarFallback className="bg-sky-100 text-base font-semibold text-sky-800 dark:bg-sky-950/40 dark:text-sky-100">
              {getClientInitials(client.nombre)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div>
              <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">{client.nombre}</h3>
              <p className="text-sm text-muted-foreground">CC {client.cedula}</p>
            </div>
            <Badge variant="outline" className={getStateIndicatorClass(client.estado)}>
              {client.estado}
            </Badge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(client)}>
              <ShieldCheck />
              Ver detalle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(client)}>
              <Pencil />
              Editar cliente
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={destructiveMenuItemClass}
              onClick={() => onDelete(client)}
            >
              <Trash2 />
              Eliminar cliente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 p-5">
        <MetaRow icon={<Phone className="h-4 w-4" />} value={client.numero_telefono || "Sin telefono"} />
        <MetaRow icon={<MapPin className="h-4 w-4" />} value={client.direccion || "Sin direccion registrada"} />
        <div className="rounded-2xl border border-sky-100/80 bg-background/90 p-3 dark:border-sky-900/40">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Edad</p>
          <p className="mt-1 font-medium">
            {client.edad !== null && client.edad !== undefined ? `${client.edad} anos` : "Sin registrar"}
          </p>
        </div>
      </div>
    </article>
  );
}
