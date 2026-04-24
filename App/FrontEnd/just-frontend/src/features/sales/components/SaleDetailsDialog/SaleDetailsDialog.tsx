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
import { Sale } from "../../types/Sale";

function formatDate(value: string) {
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

interface SaleDetailsDialogProps {
  sale: Sale | null;
  onClose: () => void;
}

export function SaleDetailsDialog({ sale, onClose }: SaleDetailsDialogProps) {
  return (
    <Dialog open={Boolean(sale)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle de la venta</DialogTitle>
          <DialogDescription>
            Consulta productos, cliente, total y estado de la venta seleccionada.
          </DialogDescription>
        </DialogHeader>

        {sale ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="mt-2 font-semibold">{formatDate(sale.fecha_venta)}</p>
              </div>
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge
                  variant="outline"
                  className={`mt-2 ${getStateIndicatorClass(sale.estado)}`}
                >
                  {sale.estado}
                </Badge>
              </div>
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="mt-2 font-semibold">
                  {sale.cliente?.nombre || "Venta sin cliente"}
                </p>
              </div>
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="mt-2 font-semibold">{formatCurrency(Number(sale.total))}</p>
              </div>
            </div>

            <div className="space-y-4">
              {sale.detalles.map((detail) => (
                <div key={detail.id_detalle_venta} className="rounded-xl border p-4">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold">
                        {detail.producto?.nombre || "Producto"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {detail.producto?.categoria || "Sin categoria"}
                      </p>
                    </div>
                    <Badge variant="outline">Cantidad: {detail.cantidad}</Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Precio unitario</p>
                      <p className="mt-1 font-medium">
                        {formatCurrency(Number(detail.precio_unitario))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Descuento unitario</p>
                      <p className="mt-1 font-medium">
                        {formatCurrency(Number(detail.descuento_unitario))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Subtotal</p>
                      <p className="mt-1 font-medium">{formatCurrency(Number(detail.subtotal))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Consumos de stock</p>
                      <p className="mt-1 font-medium">
                        {(detail.consumos_stock?.length || 0).toLocaleString("es-CO")}
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
