"use client";

import { Client } from "../../types/Client";
import { ClientCard } from "../ClientCard/ClientCard";

interface ClientGridProps {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientGrid({ clients, onView, onEdit, onDelete }: ClientGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {clients.map((client) => (
        <ClientCard
          key={client.id_cliente}
          client={client}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
