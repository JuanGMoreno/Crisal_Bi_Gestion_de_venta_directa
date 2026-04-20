import { Button } from "@/shared/components/ui/button"
import Image from "next/image"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import { useDialogStore } from "@/store/use-dialog-store"
import { useProductByIdQuery } from "../../hooks/useProductByIdQuery"

const DEFAULT_PRODUCT_IMAGE = "/Logo_Just.svg"

function formatCurrency(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === "") return "$0"
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) return `$${value}`
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 2,
    }).format(numericValue)
}

export function DialogDetailsProduct() {
    const { type, closeDialog, isOpen, data } = useDialogStore()
    const isProductDialog = type === "detailsProduct"
    const productId = data?.id as string | undefined

    const { data: productData } = useProductByIdQuery(productId)

    if (!isProductDialog) return null


    return (
        <Dialog open={isOpen && isProductDialog} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-md md:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalles del Producto</DialogTitle>
                        <DialogDescription>Información detallada del producto seleccionado.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-start">
                        <div className="mx-auto md:mx-0">
                            {productData?.foto_avatar?.trim() ? (
                                <Image
                                    src={productData.foto_avatar as string}
                                    alt={productData.nombre as string}
                                    width={220}
                                    height={220}
                                    className="h-55 w-55 rounded-xl border object-cover shadow-sm"
                                />
                            ) : (
                                <Image
                                    src={DEFAULT_PRODUCT_IMAGE}
                                    alt="Imagen por defecto del producto"
                                    width={220}
                                    height={220}
                                    className="h-55 w-55 rounded-xl border object-cover shadow-sm"
                                />
                            )}
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold leading-tight text-primary">
                                {productData?.nombre || "Producto sin nombre"}
                            </h3>

                            <div className="space-y-2 text-sm">
                                <p>
                                    <span className="font-medium text-muted-foreground">Descripción: </span>
                                    <span>{productData?.descripcion?.trim() || "Sin descripción"}</span>
                                </p>
                                <p>
                                    <span className="font-medium text-muted-foreground">Código: </span>
                                    <span>{productData?.codigo || "Sin código"}</span>
                                </p>
                                <p>
                                    <span className="font-medium text-muted-foreground">Estado: </span>
                                    <span>{productData?.estado || "Sin estado"}</span>
                                </p>
                                <p>
                                    <span className="font-medium text-muted-foreground">Categoría: </span>
                                    <span>{productData?.categoria || "Sin categoría"}</span>
                                </p>
                            </div>

                            <div className="grid gap-3 pt-1 sm:grid-cols-1">
                                <div className="rounded-lg border bg-muted/30 p-3">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Precio Base de Venta</p>
                                    <p className="text-lg font-semibold text-primary">{formatCurrency(productData?.precio_base_venta)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cerrar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
        </Dialog>
    )
}
