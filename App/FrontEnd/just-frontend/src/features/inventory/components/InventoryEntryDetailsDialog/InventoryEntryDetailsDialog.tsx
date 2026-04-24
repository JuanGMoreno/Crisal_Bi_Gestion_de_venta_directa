"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { getStateIndicatorClass } from "@/shared/lib/status-indicators";
import { InventoryEntry } from "../../types/Inventory";

function formatDate(value?: string) {
  if (!value) return "Sin fecha registrada";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 2,
  }).format(value);
}

interface InventoryEntryDetailsDialogProps {
  entry: InventoryEntry | null;
  onClose: () => void;
}

export function InventoryEntryDetailsDialog({
  entry,
  onClose,
}: InventoryEntryDetailsDialogProps) {
  return (
    <Dialog open={Boolean(entry)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle del ingreso</DialogTitle>
          <DialogDescription>
            Revisa los productos, cantidades y vencimientos registrados en este ingreso.
          </DialogDescription>
        </DialogHeader>

        {entry ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">Fecha de ingreso</p>
                <p className="mt-2 font-semibold">{formatDate(entry.fecha_ingreso)}</p>
              </div>
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge
                  variant="outline"
                  className={`mt-2 ${getStateIndicatorClass(entry.estado)}`}
                >
                  {entry.estado}
                </Badge>
              </div>
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">Observacion</p>
                <p className="mt-2 text-sm">
                  {entry.observacion?.trim() || "Sin observaciones registradas"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {entry.detalles.map((detail) => (
                <div key={detail.id_detalle_ingreso} className="rounded-xl border p-4">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold">
                        {detail.producto?.nombre || "Producto"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {detail.producto?.categoria || "Sin categoria"}
                      </p>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      Disponible: {detail.cantidad_disponible.toLocaleString("es-CO")}
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cantidad inicial</p>
                      <p className="mt-1 font-medium">
                        {detail.cantidad_inicial.toLocaleString("es-CO")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Costo unitario</p>
                      <p className="mt-1 font-medium">
                        {formatCurrency(detail.costo_unitario_compra)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lote</p>
                      <p className="mt-1 font-medium">
                        {detail.numero_lote_fabricacion || "Sin lote"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vencimiento</p>
                      <p className="mt-1 font-medium">
                        {formatDate(detail.fecha_vencimiento)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
