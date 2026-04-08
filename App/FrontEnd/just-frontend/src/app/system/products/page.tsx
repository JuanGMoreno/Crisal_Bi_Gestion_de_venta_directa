"use client";

import { Button } from "@/shared/components/ui/button";
import { useEffect } from "react";
import HeaderManagerProduct from "@/features/products/components/HeaderManagerProduct/HeaderManagerProduct";
import { columns } from "@/features/products/components/columns/columns";
import { DataTable } from "@/features/products/components/data-table/data-table";
import { toast } from "sonner";
import { EmptyGlobal } from "@/shared/components/empty-global";
import { Loader2, Package2 } from "lucide-react";
import { useDialogStore } from "@/store/use-dialog-store";
import { useProductsQuery } from "@/features/products/hooks/useProductsQuery";
import { ProductTableSkeleton } from "@/features/products/components/data-table/ProductTableSkeleton";

export default function PageProducts() {
    const onOpenDialog = useDialogStore((state) => state.openDialog);
    const { data: products = [], isLoading, isFetching, isError, error, refetch } = useProductsQuery();

    useEffect(() => {
        if (isError) {
            toast.error(error instanceof Error ? error.message : "Error al cargar los productos", {
                position: "top-right",
            });
        }
    }, [isError, error]);

    if (isLoading) {
        return (
            <div>
                <HeaderManagerProduct />
                <div className="m-4">
                    <ProductTableSkeleton />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <HeaderManagerProduct />
                <div className="m-4">
                    <EmptyGlobal
                        icon={<Package2 className="h-12 w-12" />}
                        title="No se pudieron cargar los productos"
                        description={error instanceof Error ? error.message : "Ocurrió un error inesperado."}
                        buttonText="Reintentar"
                        onButtonClick={() => {
                            void refetch();
                        }}
                        className="border border-dashed"
                    />
                </div>
            </div>
        );
    }

    return (
        <div>
            <HeaderManagerProduct />
            <div className="m-4">
                {isFetching && (
                    <div className="mb-3 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Actualizando productos...
                    </div>
                )}
                {products.length === 0 ? (
                    <EmptyGlobal
                        icon={<Package2 className="h-12 w-12" />}
                        title="No se encontraron productos"
                        description="No tienes ningún producto aún."
                        buttonText="Agregar Producto"
                        onButtonClick={() => onOpenDialog("createProduct")}
                        className="border border-dashed"
                    />
                ) : (
                    <DataTable columns={columns} data={products} />
                )}
            </div>
        </div>
    );
}