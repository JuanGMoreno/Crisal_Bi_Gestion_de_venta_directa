"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ClipboardPen,
  PencilLine,
  ReceiptText,
  Sparkles,
  Users,
} from "lucide-react";
import { SaleForm } from "@/features/sales/components/SaleForm/SaleForm";
import { useSaleClientsQuery } from "@/features/sales/hooks/useSaleClientsQuery";
import { useSaleQuery } from "@/features/sales/hooks/useSalesQuery";
import { EmptyGlobal } from "@/shared/components/empty-global";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import AllUrls from "@/urls";

interface EditSalePageProps {
  params: Promise<{ id: string }>;
}

function EditSaleSkeleton() {
  return (
    <div className="m-4 space-y-6">
      <div className="rounded-[28px] border p-6 shadow-sm">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-4 h-8 w-56" />
        <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      </div>
      <div className="rounded-[28px] border p-6 shadow-sm">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-6 h-72 w-full" />
      </div>
    </div>
  );
}

export default function PageEditSale({ params }: EditSalePageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: sale, isLoading, isError, error } = useSaleQuery(id);
  const { data: clients = [] } = useSaleClientsQuery();

  if (isLoading) {
    return <EditSaleSkeleton />;
  }

  if (isError || !sale) {
    return (
      <div className="m-4">
        <EmptyGlobal
          icon={<ReceiptText className="h-12 w-12" />}
          title="No se pudo cargar la venta"
          description={
            error instanceof Error ? error.message : "No se encontró la venta solicitada."
          }
          buttonText="Volver a ventas"
          onButtonClick={() => router.push(AllUrls["system:sales"])}
          className="border border-dashed"
        />
      </div>
    );
  }

  if (sale.estado !== "Abierta") {
    return (
      <div className="m-4">
        <EmptyGlobal
          icon={<ReceiptText className="h-12 w-12" />}
          title="Esta venta no se puede editar"
          description="Solo las ventas abiertas pueden modificarse. Si ya está cerrada o anulada, conserva su historial y trazabilidad."
          buttonText="Volver a ventas"
          onButtonClick={() => router.push(AllUrls["system:sales"])}
          className="border border-dashed"
        />
      </div>
    );
  }

  return (
    <div className="m-4 space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border bg-gradient-to-br from-primary/25 via-primary/10 to-sky-500/15 p-6 shadow-sm dark:from-primary/25 dark:via-primary/10 dark:to-sky-500/10">
        <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-primary/30 blur-3xl dark:bg-primary/20" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-36 w-36 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

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
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/90 px-3 py-1 text-sm text-foreground/75 shadow-sm backdrop-blur dark:border-primary/35 dark:bg-background/80">
                <PencilLine className="h-4 w-4 text-primary" />
                Editar venta abierta
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Actualizar venta</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/70 md:text-base">
                  Ajusta cliente, fecha o productos de la venta antes de cerrarla. El inventario no
                  se afecta hasta que la cierres desde el listado.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="border-primary/25 bg-background/90 px-3 py-1.5 shadow-sm dark:border-primary/35 dark:bg-background/80"
              >
                <Users className="mr-2 h-4 w-4" />
                {clients.length.toLocaleString("es-CO")} clientes activos
              </Badge>
              <Badge
                variant="outline"
                className="border-primary/25 bg-background/90 px-3 py-1.5 shadow-sm dark:border-primary/35 dark:bg-background/80"
              >
                <ReceiptText className="mr-2 h-4 w-4" />
                {sale.detalles.length} producto{sale.detalles.length > 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[28px] border bg-gradient-to-b from-background via-background to-primary/5 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 border-b border-border/70 pb-5">
            <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/20 to-sky-500/10 p-2.5 text-primary dark:border-primary/35 dark:from-primary/20 dark:to-sky-500/10">
              <ClipboardPen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Datos de la venta</h2>
              <p className="text-sm text-muted-foreground">
                Mantuvimos esta vista más simple para que puedas corregir la venta con rapidez.
              </p>
            </div>
          </div>

          <SaleForm
            mode="edit"
            saleId={sale.id_venta}
            initialSale={sale}
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
              Guardar cambios
            </Button>
          </div>
        </section>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="overflow-hidden rounded-[28px] border bg-gradient-to-br from-primary/10 via-background to-sky-500/10 shadow-sm">
            <div className="border-b border-border/70 bg-gradient-to-r from-primary/15 via-primary/10 to-sky-500/10 p-5 dark:from-primary/20 dark:via-primary/10 dark:to-sky-500/10">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/85 px-3 py-1 text-xs font-medium text-foreground/70 dark:border-primary/35 dark:bg-background/80">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Edición rápida
              </div>
              <h3 className="font-semibold">Siguiente paso</h3>
              <p className="mt-1 text-sm text-foreground/70">
                Cuando termines de ajustar la venta, vuelve al listado y ciérrala para impactar el
                inventario.
              </p>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-primary/15 bg-background/90 p-4 shadow-sm dark:border-primary/20">
                <p className="text-sm text-muted-foreground">Cliente actual</p>
                <p className="mt-1 font-semibold">{sale.cliente?.nombre || "Cliente sin cargar"}</p>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/18 to-sky-500/10 p-4 text-sm text-foreground dark:border-primary/25 dark:from-primary/15 dark:to-sky-500/10">
                Los cambios solo están disponibles porque la venta sigue abierta.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
