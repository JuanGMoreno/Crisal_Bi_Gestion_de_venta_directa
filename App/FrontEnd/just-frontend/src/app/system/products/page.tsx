"use client";

import { useCallback, useEffect, useState } from "react";
import HeaderManagerProduct from "@/features/products/components/HeaderManagerProduct/HeaderManagerProduct";
import { columns } from "@/features/products/components/columns/columns";
import { ItemProductTable } from "@/features/products/types/Product";
import { DataTable } from "@/features/products/components/data-table/data-table";
import useProductServices from "@/features/products/services/productServices";
import { toast } from "sonner";
import { EmptyGlobal } from "@/shared/components/empty-global";
import { Package2 } from "lucide-react";
import { useDialogStore } from "@/store/use-dialog-store";

export default function PageProducts() {
    const [products, setProducts] = useState<ItemProductTable[]>([]);
    const { getProducts } = useProductServices();
    const onOpenDialog = useDialogStore((state) => state.openDialog);

    const loadProducts = useCallback(async (): Promise<ItemProductTable[]> => {
        try {
            const productsPromise = getProducts();

            toast.promise(productsPromise, {
                loading: "Cargando productos...",
                success: "Productos cargados correctamente",
                error: (error) => (error instanceof Error ? error.message : "Error al cargar los productos"),
                position: "top-right",
            });

            const response = await productsPromise;

            return response.map((product) => ({
                nombre: product.nombre,
                codigo: product.codigo,
                precio_compra: product.precio_compra,
                precio_venta: product.precio_venta,
                estado: product.estado,
            }));
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            return [];
        }
    }, [getProducts]);

    useEffect(() => {
        let isActive = true;

        const syncProducts = async () => {
            const items = await loadProducts();
            if (isActive) {
                setProducts(items);
            }
        };

        void syncProducts();

        return () => {
            isActive = false;
        };
    }, [loadProducts]);

    return (
        <div>
            <HeaderManagerProduct />
            <div className="m-4">
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