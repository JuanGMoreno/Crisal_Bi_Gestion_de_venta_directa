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
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import {
  destructiveMenuItemClass,
  getStateIndicatorClass,
} from "@/shared/lib/status-indicators";
import { InventoryEntry } from "../../types/Inventory";

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

interface InventoryColumnsOptions {
  onViewDetails: (entry: InventoryEntry) => void;
  onDelete: (entry: InventoryEntry) => void;
}

export function createInventoryColumns({
  onViewDetails,
  onDelete,
}: InventoryColumnsOptions): ColumnDef<InventoryEntry>[] {
  return [
    {
      accessorKey: "fecha_ingreso",
      header: () => <div>Fecha</div>,
      cell: ({ row }) => (
        <span className="text-xs font-medium text-muted-foreground">
          {formatDate(row.original.fecha_ingreso)}
        </span>
      ),
    },
    {
      id: "productos",
      accessorFn: (row) =>
        row.detalles
          .map((detail) => detail.producto?.nombre || detail.id_producto)
          .join(", "),
      header: () => <div>Productos</div>,
      cell: ({ row }) => {
        const labels = row.original.detalles
          .map((detail) => detail.producto?.nombre || "Producto")
          .slice(0, 2);
        const remaining = row.original.detalles.length - labels.length;

        return (
          <div className="space-y-1">
            {labels.map((label) => (
              <div key={`${row.original.id_ingreso}-${label}`} className="font-medium">
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
      id: "lotes",
      accessorFn: (row) => row.detalles.length,
      header: () => <div className="text-center">Lotes</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline">{row.original.detalles.length}</Badge>
        </div>
      ),
    },
    {
      id: "unidades",
      accessorFn: (row) =>
        row.detalles.reduce((sum, detail) => sum + detail.cantidad_disponible, 0),
      header: () => <div className="text-center">Unidades</div>,
      cell: ({ row }) => {
        const units = row.original.detalles.reduce(
          (sum, detail) => sum + detail.cantidad_disponible,
          0
        );

        return <div className="text-center font-semibold">{units}</div>;
      },
    },
    {
      id: "costo_promedio",
      accessorFn: (row) => {
        const totalUnits = row.detalles.reduce(
          (sum, detail) => sum + detail.cantidad_inicial,
          0
        );

        if (totalUnits === 0) return 0;

        const weightedCost = row.detalles.reduce(
          (sum, detail) => sum + detail.costo_unitario_compra * detail.cantidad_inicial,
          0
        );

        return weightedCost / totalUnits;
      },
      header: () => <div className="text-center">Costo Promedio</div>,
      cell: ({ row }) => {
        const totalUnits = row.original.detalles.reduce(
          (sum, detail) => sum + detail.cantidad_inicial,
          0
        );
        const weightedCost = row.original.detalles.reduce(
          (sum, detail) => sum + detail.costo_unitario_compra * detail.cantidad_inicial,
          0
        );
        const averageCost = totalUnits === 0 ? 0 : weightedCost / totalUnits;

        return (
          <div className="text-center font-semibold text-primary">
            {formatCurrency(averageCost)}
          </div>
        );
      },
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
        const entry = row.original;

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
                <DropdownMenuItem onClick={() => onViewDetails(entry)}>
                  <Eye />
                  Ver detalle
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={destructiveMenuItemClass}
                  onClick={() => onDelete(entry)}
                >
                  <Trash2 />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
