import { Button } from "@/shared/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import { FieldGroup } from "@/shared/components/ui/field"
import { useDialogStore } from "@/store/use-dialog-store"
import ProductForm from "../ProductForm/ProductForm"

export function DialogProduct() {
    const { type , closeDialog , isOpen } = useDialogStore()
    return (
        <Dialog open={isOpen && type === "createProduct"} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Crear Producto</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        {type === "createProduct" && <ProductForm />}
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" form="form-product">
                            Crear Producto
                        </Button>
                    </DialogFooter>
                </DialogContent>
        </Dialog>
    )
}
