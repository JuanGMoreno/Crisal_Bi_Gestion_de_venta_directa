"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Client } from "../../types/Client";
import { ClientForm } from "../ClientForm/ClientForm";

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  client?: Client | null;
}

export function ClientDialog({
  open,
  onOpenChange,
  mode = "create",
  client,
}: ClientDialogProps) {
  const isEditMode = mode === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar cliente" : "Registrar cliente"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Actualiza los datos del cliente para mantener su informacion al dia."
              : "Registra un nuevo cliente para usarlo luego en tus ventas y seguimiento."}
          </DialogDescription>
        </DialogHeader>

        <ClientForm
          key={`${isEditMode ? client?.id_cliente || "edit" : "create"}-${open ? "open" : "closed"}`}
          mode={isEditMode ? "edit" : "create"}
          clientId={client?.id_cliente}
          initialClient={client}
          onSuccess={() => onOpenChange(false)}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="form-client">
            {isEditMode ? "Guardar cambios" : "Guardar cliente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
