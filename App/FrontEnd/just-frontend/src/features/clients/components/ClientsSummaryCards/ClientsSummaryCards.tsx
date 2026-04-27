"use client";

import { MapPin, Phone, UsersRound } from "lucide-react";
import { Client } from "../../types/Client";

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="rounded-2xl border bg-rose-50 p-2.5 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/20 dark:text-rose-300">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function ClientsSummaryCards({ clients }: { clients: Client[] }) {
  const clientsWithPhone = clients.filter((client) => client.numero_telefono?.trim()).length;
  const clientsWithAddress = clients.filter((client) => client.direccion?.trim()).length;

  return (
    <div className="m-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <SummaryCard
        title="Clientes activos"
        value={clients.length.toLocaleString("es-CO")}
        description="Base actual de clientes disponibles para registrar ventas."
        icon={<UsersRound className="h-5 w-5" />}
      />
      <SummaryCard
        title="Con telefono"
        value={clientsWithPhone.toLocaleString("es-CO")}
        description="Clientes con un numero de contacto listo para seguimiento."
        icon={<Phone className="h-5 w-5" />}
      />
      <SummaryCard
        title="Con direccion"
        value={clientsWithAddress.toLocaleString("es-CO")}
        description="Clientes con direccion registrada para futuras referencias."
        icon={<MapPin className="h-5 w-5" />}
      />
    </div>
  );
}
