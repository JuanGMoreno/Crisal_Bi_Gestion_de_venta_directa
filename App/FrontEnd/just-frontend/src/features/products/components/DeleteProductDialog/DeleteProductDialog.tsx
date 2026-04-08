import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { useDialogStore } from "@/store/use-dialog-store"
import { toast } from "sonner"
import { useDeleteProductMutation } from "../../hooks/useProductMutations"


export function DeleteProductDialog() {
    const { type, closeDialog, isOpen, data } = useDialogStore()
    const deleteProductMutation = useDeleteProductMutation()
    const productId = typeof data?.id === "string" ? data.id : undefined

    const onConfirmDelete = () => {
        if (!productId) return
        deleteProductMutation.mutate(productId, {
            onSuccess: () => {
                toast.success("Producto borrado con exito", {position: "top-right"})
                closeDialog()
            },
        })
    }

    if (type !== "deleteProduct") return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
            <AlertDialogContent >
                <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar Producto</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel  >Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
                        onClick={onConfirmDelete}
                        disabled={!productId || deleteProductMutation.isPending}
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
