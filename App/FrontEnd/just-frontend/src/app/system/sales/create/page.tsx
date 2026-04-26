"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Boxes, ReceiptText, ShoppingCart, Users } from "lucide-react";
import { SaleForm } from "@/features/sales/components/SaleForm/SaleForm";
import { useSaleClientsQuery } from "@/features/sales/hooks/useSaleClientsQuery";
import { useProductsQuery } from "@/features/products/hooks/useProductsQuery";
import { useInventorySummaryQuery } from "@/features/inventory/hooks/useInventorySummaryQuery";
import AllUrls from "@/urls";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getIndicatorClass, getStockTone } from "@/shared/lib/status-indicators";

function SummarySkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-7 w-24" />
        <Skeleton className="mt-4 h-4 w-full" />
      </div>
      <div className="rounded-2xl border p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-7 w-20" />
        <Skeleton className="mt-4 h-4 w-full" />
      </div>
    </div>
  );
}

export default function PageCreateSales() {
  const router = useRouter();
  const { data: clients = [], isLoading: isClientsLoading } = useSaleClientsQuery();
  const { data: products = [], isLoading: isProductsLoading } = useProductsQuery();
  const { data: inventorySummary = [], isLoading: isInventoryLoading } = useInventorySummaryQuery();

  const activeProducts = products.filter((product) => product.estado === "Activo");
  const totalStock = inventorySummary.reduce((sum, item) => sum + Number(item.stock_total), 0);
  const stockTone = getStockTone(totalStock);
  const isSummaryLoading = isClientsLoading || isProductsLoading || isInventoryLoading;

  return (
    <div className="m-4 space-y-6">
      <div className="rounded-[28px] border bg-gradient-to-br from-background via-background to-muted/30 p-6 shadow-sm">
        <div className="space-y-4">
          <Link
            href={AllUrls["system:sales"]}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a ventas
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground shadow-sm">
                <ShoppingCart className="h-4 w-4 text-primary" />
                Nueva venta
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Crear venta
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                  Completa la venta con más espacio y mejor contexto. El formulario queda al frente y
                  la información clave se mantiene visible sin recargar la pantalla.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="px-3 py-1.5">
                <Users className="mr-2 h-4 w-4" />
                {clients.length.toLocaleString("es-CO")} clientes activos
              </Badge>
              <Badge variant="outline" className="px-3 py-1.5">
                <ReceiptText className="mr-2 h-4 w-4" />
                {activeProducts.length.toLocaleString("es-CO")} productos activos
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[28px] border bg-background p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 border-b pb-5">
            <div className="rounded-2xl border bg-muted/40 p-2.5 text-primary">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Datos de la venta</h2>
              <p className="text-sm text-muted-foreground">
                Selecciona cliente, productos, cantidades y precio antes de guardar.
              </p>
            </div>
          </div>

          <SaleForm
            onSuccess={() => {
              router.push(AllUrls["system:sales"]);
            }}
          />

          <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
            <Link href={AllUrls["system:sales"]}>
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" form="form-sale" className="w-full sm:w-auto">
              Crear venta
            </Button>
          </div>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          {isSummaryLoading ? (
            <SummarySkeleton />
          ) : (
            <>
              <div className="rounded-[28px] border bg-background p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Boxes className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Contexto rapido</h3>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <p className="text-sm text-muted-foreground">Stock disponible</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-2xl font-semibold">
                        {totalStock.toLocaleString("es-CO")}
                      </p>
                      <Badge variant="outline" className={getIndicatorClass(stockTone)}>
                        {stockTone === "good"
                          ? "Stock saludable"
                          : stockTone === "warning"
                            ? "Stock moderado"
                            : "Stock bajo"}
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                    Si guardas la venta como <span className="font-medium text-foreground">cerrada</span>,
                    el inventario se actualiza de inmediato. Si la dejas
                    <span className="font-medium text-foreground"> abierta</span>, podrás cerrarla después.
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border bg-background p-5 shadow-sm">
                <h3 className="font-semibold">Resumen rapido</h3>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <p className="text-sm text-muted-foreground">Clientes activos</p>
                    <p className="mt-1 text-lg font-semibold">
                      {clients.length.toLocaleString("es-CO")}
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <p className="text-sm text-muted-foreground">Referencias con stock</p>
                    <p className="mt-1 text-lg font-semibold">
                      {inventorySummary.length.toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
