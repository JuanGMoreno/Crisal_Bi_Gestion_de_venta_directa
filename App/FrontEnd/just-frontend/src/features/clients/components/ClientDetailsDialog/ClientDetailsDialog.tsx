"use client";

import { MapPin, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { getStateIndicatorClass } from "@/shared/lib/status-indicators";
import { Client } from "../../types/Client";

interface ClientDetailsDialogProps {
  client: Client | null;
  onClose: () => void;
}

function getClientInitials(name?: string) {
  if (!name) return "CL";

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "CL";
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-sky-100/80 bg-sky-50/40 p-3 dark:border-sky-900/40 dark:bg-sky-950/10">
      <div className="rounded-full bg-background p-2 shadow-sm ring-1 ring-sky-100 dark:ring-sky-900/40">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export function ClientDetailsDialog({ client, onClose }: ClientDetailsDialogProps) {
  return (
    <Dialog open={Boolean(client)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalle del cliente</DialogTitle>
          <DialogDescription>
            Consulta la informacion principal del cliente y su identificacion.
          </DialogDescription>
        </DialogHeader>

        {client ? (
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-background to-blue-50 p-6 text-center dark:border-sky-900/40 dark:from-sky-950/20 dark:via-background dark:to-blue-950/20">
              <Avatar className="h-24 w-24 border-4 border-background shadow-sm ring-1 ring-sky-200 dark:ring-sky-900/70">
                <AvatarImage src={client.foto_avatar?.trim() || undefined} alt={client.nombre} />
                <AvatarFallback className="bg-sky-100 text-xl font-semibold text-sky-800 dark:bg-sky-950/40 dark:text-sky-100">
                  {getClientInitials(client.nombre)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold tracking-tight">{client.nombre}</h3>
                <Badge variant="outline" className={getStateIndicatorClass(client.estado)}>
                  {client.estado}
                </Badge>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <DetailRow
                icon={<ShieldCheck className="h-4 w-4 text-sky-700 dark:text-sky-300" />}
                label="Cedula"
                value={client.cedula}
              />
              <DetailRow
                icon={<UserRound className="h-4 w-4 text-sky-700 dark:text-sky-300" />}
                label="Edad"
                value={client.edad !== null && client.edad !== undefined ? String(client.edad) : "Sin registrar"}
              />
              <DetailRow
                icon={<Phone className="h-4 w-4 text-sky-700 dark:text-sky-300" />}
                label="Telefono"
                value={client.numero_telefono || "Sin registrar"}
              />
              <DetailRow
                icon={<MapPin className="h-4 w-4 text-sky-700 dark:text-sky-300" />}
                label="Direccion"
                value={client.direccion || "Sin registrar"}
              />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
