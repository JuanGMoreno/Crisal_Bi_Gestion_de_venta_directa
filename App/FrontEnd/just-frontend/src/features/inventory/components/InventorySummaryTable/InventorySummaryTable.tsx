"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, SearchX } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { InventorySummaryItem } from "../../types/Inventory";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "Sin vencimiento";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(new Date(value));
}

const columns: ColumnDef<InventorySummaryItem>[] = [
  {
    accessorKey: "nombre",
    header: "Producto",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.nombre}</p>
        <p className="text-xs text-muted-foreground">{row.original.codigo}</p>
      </div>
    ),
  },
  {
    accessorKey: "categoria",
    header: "Categoria",
  },
  {
    accessorKey: "stock_total",
    header: () => <div className="text-center">Stock</div>,
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        {row.original.stock_total.toLocaleString("es-CO")}
      </div>
    ),
  },
  {
    accessorKey: "lotes_activos",
    header: () => <div className="text-center">Lotes</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.lotes_activos.toLocaleString("es-CO")}</div>
    ),
  },
  {
    id: "valor_total",
    accessorFn: (row) => row.stock_total * Number(row.costo_promedio_compra),
    header: () => <div className="text-center">Valor Total</div>,
    cell: ({ row }) => (
      <div className="text-center font-semibold text-primary">
        {formatCurrency(row.original.stock_total * Number(row.original.costo_promedio_compra))}
      </div>
    ),
  },
  {
    id: "proximo_vencimiento",
    accessorFn: (row) => row.proximas_fechas_vencimiento?.[0] || "",
    header: () => <div className="text-center">Proximo Vencimiento</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {formatDate(row.original.proximas_fechas_vencimiento?.[0])}
      </div>
    ),
  },
];

interface InventorySummaryTableProps {
  data: InventorySummaryItem[];
}

export function InventorySummaryTable({ data }: InventorySummaryTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div>
      <div className="my-4 flex overflow-hidden rounded-md border p-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por producto, codigo o categoria..."
            value={globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm pl-10"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <SearchX className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No se encontraron productos.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
