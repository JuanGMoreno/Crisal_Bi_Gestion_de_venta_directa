"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { ItemProductTable } from "../../types/Product"


 
export const columns: ColumnDef<ItemProductTable>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "codigo",
    header: "Código",
  },
  {
    accessorKey: "precio_compra",
    header: "Precio de Compra",
  },
    {
    accessorKey: "precio_venta",
    header: "Precio de Venta",
  },
    {
    accessorKey: "estado",
    header: "Estado",
  },      

]