"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function HeaderManagerClients({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="m-4 mb-4 flex items-center justify-between gap-4">
      <div>
        <h2 className="pb-2 text-3xl font-bold">Gestion de Clientes</h2>
        <p className="text-muted-foreground">
          Registra y actualiza tus clientes para mantener ordenado el seguimiento comercial.
        </p>
      </div>
      <Button size="lg" onClick={onCreate}>
        Registrar cliente
        <UserPlus className="ml-2" />
      </Button>
    </div>
  );
}
