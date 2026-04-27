"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Boxes,
  ReceiptText,
  ShoppingCart,
  Sparkles,
  Users,
} from "lucide-react";
import { SaleForm } from "@/features/sales/components/SaleForm/SaleForm";
import { useSaleClientsQuery } from "@/features/sales/hooks/useSaleClientsQuery";
import { useProductsQuery } from "@/features/products/hooks/useProductsQuery";
import { useInventorySummaryQuery } from "@/features/inventory/hooks/useInventorySummaryQuery";
import AllUrls from "@/urls";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getIndicatorClass, getStockTone } from "@/shared/lib/status-indicators";

function SummarySkeleton() {
  return (
    <div className="rounded-[28px] border p-5 shadow-sm">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-10 w-32" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-3 h-20 w-full" />
    </div>
  );
}

export default function PageCreateSales() {
  const router = useRouter();
  const { data: clients = [], isLoading: isClientsLoading } = useSaleClientsQuery();
  const { data: products = [], isLoading: isProductsLoading } = useProductsQuery();
  const { data: inventorySummary = [], isLoading: isInventoryLoading } =
    useInventorySummaryQuery();

  const activeProducts = products.filter((product) => product.estado === "Activo");
  const totalStock = inventorySummary.reduce((sum, item) => sum + Number(item.stock_total), 0);
  const stockTone = getStockTone(totalStock);
  const isSummaryLoading = isClientsLoading || isProductsLoading || isInventoryLoading;

  return (
    <div className="m-4 space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border bg-gradient-to-br from-sky-100 via-background to-blue-100 p-6 shadow-sm dark:from-sky-950/25 dark:via-background dark:to-blue-950/15">
        <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-sky-300/35 blur-3xl dark:bg-sky-500/15" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-36 w-36 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-500/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-300/80 to-transparent dark:via-sky-500/30" />

        <div className="relative space-y-4">
          <Link
            href={AllUrls["system:sales"]}
            className="inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a ventas
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-background/90 px-3 py-1 text-sm text-foreground/75 shadow-sm backdrop-blur dark:border-sky-900/70 dark:bg-background/80">
                <ShoppingCart className="h-4 w-4 text-sky-700 dark:text-sky-300" />
                Nueva venta
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Crear venta</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/70 md:text-base">
                  Registra la venta con una vista más clara, con el formulario al centro y el
                  contexto útil acompañando sin distraer.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="border-sky-200 bg-background/90 px-3 py-1.5 shadow-sm dark:border-sky-900/70 dark:bg-background/80"
              >
                <Users className="mr-2 h-4 w-4" />
                {clients.length.toLocaleString("es-CO")} clientes activos
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-200 bg-background/90 px-3 py-1.5 shadow-sm dark:border-blue-900/70 dark:bg-background/80"
              >
                <ReceiptText className="mr-2 h-4 w-4" />
                {activeProducts.length.toLocaleString("es-CO")} productos activos
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[28px] border bg-gradient-to-b from-background via-background to-sky-50/70 p-6 shadow-sm dark:to-sky-950/10">
          <div className="mb-6 flex items-center gap-3 border-b border-border/70 pb-5">
            <div className="rounded-2xl border border-sky-200 bg-sky-100 p-2.5 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-300">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Datos de la venta</h2>
              <p className="text-sm text-muted-foreground">
                Define cliente, productos, cantidades y precios antes de registrar la operación.
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

        <aside className="xl:sticky xl:top-6 xl:self-start">
          {isSummaryLoading ? (
            <SummarySkeleton />
          ) : (
            <div className="overflow-hidden rounded-[28px] border bg-gradient-to-br from-sky-50 via-background to-blue-50 shadow-sm dark:from-sky-950/15 dark:via-background dark:to-blue-950/15">
              <div className="border-b border-border/70 bg-gradient-to-r from-sky-100/75 via-sky-50/50 to-blue-100/75 p-5 dark:from-sky-950/25 dark:via-background dark:to-blue-950/20">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-background/85 px-3 py-1 text-xs font-medium text-foreground/70 dark:border-sky-900/70 dark:bg-background/80">
                  <Sparkles className="h-3.5 w-3.5 text-sky-700 dark:text-sky-300" />
                  Contexto de la operación
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">Stock disponible</h3>
                    <p className="mt-1 text-sm text-foreground/70">
                      Referencia rápida mientras completas la venta.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-sky-200 bg-background/90 p-2 text-sky-700 shadow-sm dark:border-sky-900/70 dark:bg-background/80 dark:text-sky-300">
                    <Boxes className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="rounded-2xl border border-sky-100 bg-background/90 p-4 shadow-sm dark:border-sky-900/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Unidades disponibles</p>
                      <p className="mt-1 text-3xl font-semibold tracking-tight">
                        {totalStock.toLocaleString("es-CO")}
                      </p>
                    </div>
                    <Badge variant="outline" className={getIndicatorClass(stockTone)}>
                      {stockTone === "good"
                        ? "Stock saludable"
                        : stockTone === "warning"
                          ? "Stock moderado"
                          : "Stock bajo"}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    {inventorySummary.length.toLocaleString("es-CO")} referencias con stock para
                    vender.
                  </p>
                </div>

                <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 text-sm text-sky-950 dark:border-sky-900/40 dark:bg-sky-950/20 dark:text-sky-100">
                  Si guardas la venta como <span className="font-semibold">cerrada</span>, el
                  inventario se actualiza al momento.
                </div>

                <div className="rounded-2xl border bg-background/75 p-4 text-sm text-muted-foreground">
                  Si prefieres revisarla después, puedes dejarla{" "}
                  <span className="font-medium text-foreground">abierta</span> y cerrarla más
                  adelante.
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
