"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { CheckCircle2, Eye, MoreHorizontal, OctagonX } from "lucide-react";
import {
  destructiveMenuItemClass,
  getStateIndicatorClass,
} from "@/shared/lib/status-indicators";
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

interface SalesColumnsOptions {
  onViewDetails: (sale: Sale) => void;
  onCloseSale: (sale: Sale) => void;
  onCancelSale: (sale: Sale) => void;
}

export function createSalesColumns({
  onViewDetails,
  onCloseSale,
  onCancelSale,
}: SalesColumnsOptions): ColumnDef<Sale>[] {
  return [
    {
      accessorKey: "fecha_venta",
      header: () => <div>Fecha</div>,
      cell: ({ row }) => (
        <span className="text-xs font-medium text-muted-foreground">
          {formatDate(row.original.fecha_venta)}
        </span>
      ),
    },
    {
      id: "cliente",
      accessorFn: (row) => row.cliente?.nombre || "Venta sin cliente",
      header: () => <div>Cliente</div>,
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.cliente?.nombre || "Venta sin cliente"}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.cliente?.cedula || "Sin cedula asociada"}
          </p>
        </div>
      ),
    },
    {
      id: "productos",
      accessorFn: (row) =>
        row.detalles.map((detail) => detail.producto?.nombre || detail.id_producto).join(", "),
      header: () => <div>Productos</div>,
      cell: ({ row }) => {
        const labels = row.original.detalles
          .map((detail) => detail.producto?.nombre || "Producto")
          .slice(0, 2);
        const remaining = row.original.detalles.length - labels.length;

        return (
          <div className="space-y-1">
            {labels.map((label) => (
              <div key={`${row.original.id_venta}-${label}`} className="font-medium">
                {label}
              </div>
            ))}
            {remaining > 0 ? (
              <p className="text-xs text-muted-foreground">
                +{remaining} producto{remaining > 1 ? "s" : ""} adicional
                {remaining > 1 ? "es" : ""}
              </p>
            ) : null}
          </div>
        );
      },
    },
    {
      id: "items",
      accessorFn: (row) => row.detalles.length,
      header: () => <div className="text-center">Items</div>,
      cell: ({ row }) => (
        <div className="text-center font-semibold">{row.original.detalles.length}</div>
      ),
    },
    {
      accessorKey: "total",
      header: () => <div className="text-center">Total</div>,
      cell: ({ row }) => (
        <div className="text-center font-semibold text-primary">
          {formatCurrency(Number(row.original.total))}
        </div>
      ),
    },
    {
      accessorKey: "estado",
      header: () => <div className="text-center">Estado</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline" className={getStateIndicatorClass(row.original.estado)}>
            {row.original.estado}
          </Badge>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Acciones</div>,
      cell: ({ row }) => {
        const sale = row.original;

        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(sale)}>
                  <Eye />
                  Ver detalle
                </DropdownMenuItem>
                {sale.estado === "Abierta" ? (
                  <DropdownMenuItem onClick={() => onCloseSale(sale)}>
                    <CheckCircle2 />
                    Cerrar venta
                  </DropdownMenuItem>
                ) : null}
                {sale.estado !== "Anulada" ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className={destructiveMenuItemClass}
                      onClick={() => onCancelSale(sale)}
                    >
                      <OctagonX />
                      Anular venta
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
