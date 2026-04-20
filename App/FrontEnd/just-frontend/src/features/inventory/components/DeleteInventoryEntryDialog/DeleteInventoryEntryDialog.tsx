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
import { InventoryEntry } from "../../types/Inventory";
import { useDeleteInventoryEntryMutation } from "../../hooks/useInventoryMutations";

interface DeleteInventoryEntryDialogProps {
  entry: InventoryEntry | null;
  onClose: () => void;
}

export function DeleteInventoryEntryDialog({
  entry,
  onClose,
}: DeleteInventoryEntryDialogProps) {
  const deleteInventoryEntryMutation = useDeleteInventoryEntryMutation();

  const handleDelete = async () => {
    if (!entry) return;

    try {
      await toast.promise(deleteInventoryEntryMutation.mutateAsync(entry.id_ingreso), {
        loading: "Eliminando ingreso...",
        success: "Ingreso eliminado correctamente",
        error: (error) =>
          error instanceof Error ? error.message : "No se pudo eliminar el ingreso",
        position: "top-right",
      });
      onClose();
    } catch {
      return;
    }
  };

  return (
    <AlertDialog open={Boolean(entry)} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar ingreso de inventario</AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion eliminara el ingreso seleccionado. Solo deberias hacerlo si
            el stock no ha sido usado en ventas ni en otros movimientos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
