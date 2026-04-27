"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, UsersRound } from "lucide-react";
import { toast } from "sonner";
import HeaderManagerClients from "@/features/clients/components/HeaderManagerClients/HeaderManagerClients";
import { ClientDialog } from "@/features/clients/components/ClientDialog/ClientDialog";
import { ClientDetailsDialog } from "@/features/clients/components/ClientDetailsDialog/ClientDetailsDialog";
import { DeleteClientDialog } from "@/features/clients/components/DeleteClientDialog/DeleteClientDialog";
import { ClientGrid } from "@/features/clients/components/ClientGrid/ClientGrid";
import { useClientsQuery } from "@/features/clients/hooks/useClientsQuery";
import { Client } from "@/features/clients/types/Client";
import { EmptyGlobal } from "@/shared/components/empty-global";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";

function ClientCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-[24px] border p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-4 h-16 w-full rounded-2xl" />
        </div>
      ))}
    </div>
  );
}

export default function PageClients() {
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [clientToView, setClientToView] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { data: clients = [], isLoading, isFetching, isError, error, refetch } = useClientsQuery();

  useEffect(() => {
    if (isError) {
      toast.error(error instanceof Error ? error.message : "Error al cargar los clientes", {
        position: "top-right",
      });
    }
  }, [isError, error]);

  const filteredClients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return clients;
    }

    return clients.filter((client) => {
      const searchableText = [
        client.nombre,
        client.cedula,
        client.numero_telefono,
        client.direccion,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [clients, search]);

  if (isLoading) {
    return (
      <div>
        <HeaderManagerClients onCreate={() => setIsCreateDialogOpen(true)} />
        <ClientDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        <div className="m-4">
          <ClientCardsSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <HeaderManagerClients onCreate={() => setIsCreateDialogOpen(true)} />
        <ClientDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        <div className="m-4">
          <EmptyGlobal
            icon={<UsersRound className="h-12 w-12" />}
            title="No se pudieron cargar los clientes"
            description={error instanceof Error ? error.message : "Ocurrio un error inesperado."}
            buttonText="Reintentar"
            onButtonClick={() => {
              void refetch();
            }}
            className="border border-dashed"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeaderManagerClients onCreate={() => setIsCreateDialogOpen(true)} />

      <ClientDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <ClientDialog
        open={Boolean(clientToEdit)}
        onOpenChange={(open) => !open && setClientToEdit(null)}
        mode="edit"
        client={clientToEdit}
      />
      <ClientDetailsDialog client={clientToView} onClose={() => setClientToView(null)} />
      <DeleteClientDialog client={clientToDelete} onClose={() => setClientToDelete(null)} />

      <div className="m-4">
        {isFetching ? (
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Actualizando clientes...
          </div>
        ) : null}

        {clients.length > 0 ? (
          <div className="mb-4 rounded-2xl border bg-muted/30 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-semibold">Directorio de clientes</h3>
                <p className="text-sm text-muted-foreground">
                  Encuentra rapido a tus clientes, revisa su informacion y manten actualizada su
                  ficha.
                </p>
              </div>
              <div className="relative w-full md:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nombre, cedula o telefono"
                  className="border-background bg-background pl-9"
                />
              </div>
            </div>
          </div>
        ) : null}

        {clients.length === 0 ? (
          <EmptyGlobal
            icon={<UsersRound className="h-12 w-12" />}
            title="No se han registrado clientes"
            description="Cuando registres tu primer cliente, aqui podras consultarlo y gestionarlo por tarjetas."
            buttonText="Registrar cliente"
            onButtonClick={() => setIsCreateDialogOpen(true)}
            className="border border-dashed"
          />
        ) : filteredClients.length === 0 ? (
          <EmptyGlobal
            icon={<Search className="h-12 w-12" />}
            title="No encontramos coincidencias"
            description="Prueba con otro nombre, cedula o telefono para ubicar al cliente."
            buttonText="Limpiar busqueda"
            onButtonClick={() => setSearch("")}
            className="border border-dashed"
          />
        ) : (
          <ClientGrid
            clients={filteredClients}
            onView={(client) => setClientToView(client)}
            onEdit={(client) => setClientToEdit(client)}
            onDelete={(client) => setClientToDelete(client)}
          />
        )}
      </div>
    </div>
  );
}
