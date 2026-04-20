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
import { InventoryEntryForm } from "../InventoryEntryForm/InventoryEntryForm";

interface InventoryEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventoryEntryDialog({
  open,
  onOpenChange,
}: InventoryEntryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar ingreso de inventario</DialogTitle>
          <DialogDescription>
            Usa tu catalogo de productos como referencia y registra las cantidades,
            costos y vencimientos del ingreso.
          </DialogDescription>
        </DialogHeader>

        <InventoryEntryForm onSuccess={() => onOpenChange(false)} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="form-inventory-entry">
            Guardar ingreso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
