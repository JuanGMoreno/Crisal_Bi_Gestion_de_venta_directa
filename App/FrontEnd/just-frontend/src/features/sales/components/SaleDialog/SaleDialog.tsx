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
import { SaleForm } from "../SaleForm/SaleForm";

interface SaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaleDialog({ open, onOpenChange }: SaleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar venta</DialogTitle>
          <DialogDescription>
            Crea una venta nueva, selecciona productos y decide si debe quedar abierta o cerrada.
          </DialogDescription>
        </DialogHeader>

        <SaleForm onSuccess={() => onOpenChange(false)} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="form-sale">
            Guardar venta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

