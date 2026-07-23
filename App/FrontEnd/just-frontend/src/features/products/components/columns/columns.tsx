"use client"

import { ColumnDef } from "@tanstack/react-table"
import Product from "../../types/Product"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { MoreHorizontal, TrashIcon, Pencil, Info } from "lucide-react"
import { useDialogStore } from "@/store/use-dialog-store"
import { getCategoryIndicatorClass } from "@/shared/lib/product-category-indicators"
import {
  destructiveMenuItemClass,
  getStateIndicatorClass,
} from "@/shared/lib/status-indicators"
import { cn } from "@/shared/lib/utils"

const DEFAULT_PRODUCT_IMAGE = "/Logo_Just.svg"

const CellDeleteProduct = ({ row }: { row: { original: Product } }) => {
  const product = row.original;
  const { openDialog } = useDialogStore();

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
          <DropdownMenuItem
            onClick={() => {
              openDialog("editProduct", { id: product.id_producto, product });
            }}
          >
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              openDialog("detailsProduct", { id: product.id_producto });
            }}
          >
            <Info />
            Ver detalles
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={destructiveMenuItemClass}
            onClick={() => {
              openDialog("deleteProduct", { id: product.id_producto });
            }}
          >
            <TrashIcon />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "foto_avatar",
    header: () => <div className="text-center">Foto</div>,
    cell: ({ row }) => {
      const imageSrc = row.original.foto_avatar?.trim() || DEFAULT_PRODUCT_IMAGE

      return (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={`Foto de ${row.original.nombre}`}
            className="h-10 w-10 rounded-md object-cover"
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = DEFAULT_PRODUCT_IMAGE
            }}
          />
        </div>
      )
    },
  },
  {
    accessorKey: "nombre",
    header: () => <div>Nombre</div>,
    cell: ({ row }) => {
      const nombre: string = row.getValue("nombre")
      return <div><span className="font-semibold">{nombre}</span></div>;
    }
  },
  {
    accessorKey: "categoria",
    header: () => <div className="text-center">Categoria</div>,
    cell: ({ row }) => {
      const categoria: string = row.getValue("categoria")

      return (
        <div className="flex justify-center">
          <span
            className={cn(
              "rounded-md border px-2 py-1 text-xs font-medium",
              getCategoryIndicatorClass(categoria)
            )}
          >
            {categoria}
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: "codigo",
    header: () => <div className="text-center">Codigo</div>,
    cell: ({ row }) => {
      const codigo: string = row.getValue("codigo")
      return (
        <div className="flex justify-center">
          <code className="rounded-md border border-slate-300 bg-slate-100 px-2 py-1 font-mono text-xs font-semibold tracking-wider text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
            {codigo}
          </code>
        </div>
      )
    }
  },
  {
    accessorKey: "precio_base_venta",
    header: () => <div className="text-center">Precio Base de Venta</div>,
    cell: ({ row }) => {
      const precio = parseFloat(row.getValue("precio_base_venta"))
      const formatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(precio)
      return <div className="flex justify-center"><span className="font-semibold text-primary">{formatted}</span></div>;
    },
  },
  {
    accessorKey: "estado",
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => {
      const estado: string = row.getValue("estado")
      return (
        <div className="flex justify-center">
          <Badge variant="outline" className={getStateIndicatorClass(estado)}>
            {estado}
          </Badge>
        </div>
      )
    }
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => <CellDeleteProduct row={row} />,
  }
]
