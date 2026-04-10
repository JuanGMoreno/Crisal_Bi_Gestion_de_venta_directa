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

const DEFAULT_PRODUCT_IMAGE = "/Logo_Just.svg"

const CellDeleteProduct = ({ row }: { row: { original: Product } }) => {
  const product = row.original;
  const { openDialog } = useDialogStore();
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
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
            <Info />Ver detalles
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500 hover:bg-red-200 focus:bg-red-100 data-[state=open]:bg-red-100 hover:text-red-700 focus:text-red-700"
            onClick={() => {
              openDialog("deleteProduct", { id: product.id_producto });
              // Aquí puedes manejar la acción de eliminar el producto, por ejemplo, mostrando una confirmación antes de eliminar.
              console.log("Eliminar producto:", product);
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
    header: () => <div className="">Nombre</div>,
    cell: ({ row }) => {
      const nombre: string = row.getValue("nombre")
      return <div className=""><span className="font-semibold">{nombre}</span></div>;
    }
  },
  {
    accessorKey: "categoria",
    header: () => <div className="text-center">Categoría</div>,
    cell: ({ row }) => {
      const categoria: string = row.getValue("categoria")
      {/*Colores por categoría  
        Aromaterapia: #ac85bc
        Bienestar emocional y mental: #84b1cf
        Bienestar físico: #8bb994
        Bienestar dermo-comético: #fec465
        */}
      const colorMap: { [key: string]: string } = {
        "Aromaterapia": "border border-purple-300 bg-purple-100 text-purple-800 dark:border-purple-700 dark:bg-purple-900/35 dark:text-purple-200",
        "Bienestar emocional y mental": "border border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700 dark:bg-blue-900/35 dark:text-blue-200",
        "Bienestar físico": "border border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-200",
        "Bienestar dermo-comético": "border border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-900/35 dark:text-amber-200",
      }
      const variant = colorMap[categoria] || "border border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-900/35 dark:text-slate-200"
      return (
        <div className="flex justify-center">
          <span className={`rounded-md ${variant} px-2 py-1 text-xs font-medium`}>
            {categoria}
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: "codigo",
    header: () => <div className="text-center">Código</div>,
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
      //conversion a formato de modena local
      const precio = parseFloat(row.getValue("precio_base_venta"))
      const formatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(precio)
      return <div className="flex justify-center"><span className="text-primary font-semibold">{formatted}</span></div>;
    },
  },
  {
    accessorKey: "estado",
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => {
      const estado: string = row.getValue("estado")
      const estadoClassName = estado === "Activo"
        ? "border-emerald-300 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:border-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-200 dark:hover:bg-emerald-900/50"
        : "border-rose-300 bg-rose-100 text-rose-800 hover:bg-rose-200 dark:border-rose-700 dark:bg-rose-900/35 dark:text-rose-200 dark:hover:bg-rose-900/50"
      return (
        <div className="flex justify-center">
          <Badge variant="outline" className={estadoClassName}>
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