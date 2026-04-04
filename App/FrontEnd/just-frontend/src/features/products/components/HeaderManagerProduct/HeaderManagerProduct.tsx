import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { DialogProduct } from "../DialogProduct/DialogCreateProduct";
import { useDialogStore } from "@/store/use-dialog-store";

export default function HeaderManagerProduct() {
  const onOpenDialog = useDialogStore((state) => state.openDialog);
  return (
    <>
      <DialogProduct />
      <div className="mb-4 m-4 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold pb-2">Gestión de Productos</h2>
          <p className=" text-gray-400">Gestiona tu catalogo de productos,precios y estados en cuanto a stock</p>
        </div>
        <Button size="lg" onClick={() => onOpenDialog("createProduct")}>
          Agregar Producto
          <Plus className="ml-2" />
        </Button>
      </div>
    </>
  );
}