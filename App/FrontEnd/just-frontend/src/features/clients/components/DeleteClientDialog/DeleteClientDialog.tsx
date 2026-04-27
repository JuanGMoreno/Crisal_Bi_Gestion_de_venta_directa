"use client";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useDeleteClientMutation } from "../../hooks/useClientMutations";
import { Client } from "../../types/Client";
import { getIndicatorClass } from "@/shared/lib/status-indicators";

interface DeleteClientDialogProps {
  client: Client | null;
  onClose: () => void;
}

export function DeleteClientDialog({ client, onClose }: DeleteClientDialogProps) {
  const deleteClientMutation = useDeleteClientMutation();

  const handleDelete = async () => {
    if (!client) return;

    await toast.promise(deleteClientMutation.mutateAsync(client.id_cliente), {
      loading: "Eliminando cliente...",
      success: "Cliente eliminado correctamente",
      error: (error) =>
        error instanceof Error ? error.message : "No se pudo eliminar el cliente",
      position: "top-right",
    });

    onClose();
  };

  return (
    <AlertDialog open={Boolean(client)} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar cliente</AlertDialogTitle>
          <AlertDialogDescription>
            {client
              ? `Se eliminara a ${client.nombre}. Esta accion no se puede deshacer.`
              : "Esta accion no se puede deshacer."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => void handleDelete()} className={getIndicatorClass("bad")}>
            Eliminar cliente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
