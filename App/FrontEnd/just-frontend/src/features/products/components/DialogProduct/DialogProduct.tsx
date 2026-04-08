import { Button } from "@/shared/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import { FieldGroup } from "@/shared/components/ui/field"
import { useDialogStore } from "@/store/use-dialog-store"
import ProductForm from "../ProductForm/ProductForm"
import { ProductFormData } from "../../validations/ProductSchema"

export function DialogProduct() {
    const { type, closeDialog, isOpen, data } = useDialogStore()
    const isProductDialog = type === "createProduct" || type === "editProduct"
    const dialogTitle = type === "editProduct" ? "Editar Producto" : "Crear Producto"
    const dialogDescription = type === "editProduct"
        ? "Modifica los datos del producto y guarda los cambios."
        : "Completa los datos para crear un nuevo producto."
    const submitLabel = type === "editProduct" ? "Guardar cambios" : "Crear Producto"
    const productId = typeof data?.id === "string" ? data.id : undefined
    const initialData = (data?.product as Partial<ProductFormData> | undefined) ?? undefined

    if (!isProductDialog) return null

    return (
        <Dialog open={isOpen && isProductDialog} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-sm md:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>{dialogDescription}</DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <ProductForm
                            key={`${type}-${productId ?? "new"}-${isOpen ? "open" : "closed"}`}
                            initialData={initialData}
                            type={type === "editProduct" ? "editProduct" : "createProduct"}
                            productId={productId}
                        />
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" form="form-product">
                            {submitLabel}
                        </Button>
                    </DialogFooter>
                </DialogContent>
        </Dialog>
    )
}
