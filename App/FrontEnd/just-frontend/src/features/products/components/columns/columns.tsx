"use client"

import { ColumnDef } from "@tanstack/react-table"
import Product from "../../types/Product"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
    header: () => <div className="text-center">Nombre</div>,
    cell: ({ row }) => {
      const nombre: string = row.getValue("nombre")
      return <div className="flex justify-center"><span>{nombre}</span></div>;
    }
  },
  {
    accessorKey: "codigo",
    header: () => <div className="text-center">Código</div>,
    cell: ({ row }) => {
      const codigo: string = row.getValue("codigo")
      return <div className="flex justify-center"><span>{codigo}</span></div>;
    }
  },
  {
    accessorKey: "precio_compra",
    header: () => <div className="text-center">Precio de Compra</div>,
    cell: ({ row }) => {
      //conversion a formato de modena local
      const precio = parseFloat(row.getValue("precio_compra"))
      const formatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(precio)
      return <div className="flex justify-center"><span>{formatted}</span></div>;
    },
  },
  {
    accessorKey: "precio_venta",
    header: () => <div className="text-center">Precio de Venta</div>,
    cell: ({ row }) => {
      //conversion a formato de modena local  
      const precio = parseFloat(row.getValue("precio_venta"))
      const formatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(precio)
      return <div className="flex justify-center"><span>{formatted}</span></div>;
    },
  },
  {
    accessorKey: "estado",
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => {
      const estado: string = row.getValue("estado")
      const variant = estado === "Activo" ? "secondary" : "destructive"
      return (
        <div className="flex justify-center">
          <Badge variant={variant} >
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