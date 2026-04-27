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
import { useCancelSaleMutation, useUpdateSaleStatusMutation } from "../../hooks/useSaleMutations";
import { Sale } from "../../types/Sale";
import { getIndicatorClass } from "@/shared/lib/status-indicators";

interface UpdateSaleStatusDialogProps {
  sale: Sale | null;
  mode: "close" | "cancel";
  onClose: () => void;
}

export function UpdateSaleStatusDialog({
  sale,
  mode,
  onClose,
}: UpdateSaleStatusDialogProps) {
  const updateSaleStatusMutation = useUpdateSaleStatusMutation();
  const cancelSaleMutation = useCancelSaleMutation();

  const isCloseMode = mode === "close";

  const handleConfirm = async () => {
    if (!sale) return;

    if (isCloseMode) {
      await toast.promise(
        updateSaleStatusMutation.mutateAsync({
          id: sale.id_venta,
          estado: "Cerrada",
        }),
        {
          loading: "Cerrando venta...",
          success: "Venta cerrada correctamente",
          error: (error) =>
            error instanceof Error ? error.message : "No se pudo cerrar la venta",
          position: "top-right",
        }
      );
      onClose();
      return;
    }

    await toast.promise(cancelSaleMutation.mutateAsync(sale.id_venta), {
      loading: "Anulando venta...",
      success: "Venta anulada correctamente",
      error: (error) =>
        error instanceof Error ? error.message : "No se pudo anular la venta",
      position: "top-right",
    });
    onClose();
  };

  return (
    <AlertDialog open={Boolean(sale)} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isCloseMode ? "Cerrar venta" : "Anular venta"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isCloseMode
              ? "Al cerrar la venta, el sistema descontara el stock disponible segun la prioridad definida en inventario."
              : "Al anular la venta, el sistema restaurara el stock si la venta ya habia impactado inventario."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              isCloseMode
                ? undefined
                : getIndicatorClass("bad")
            }
          >
            {isCloseMode ? "Cerrar venta" : "Anular venta"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
