"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ClipboardPen,
  PackageCheck,
  PackagePlus,
  Sparkles,
  Tags,
} from "lucide-react";
import { InventoryEntryForm } from "@/features/inventory/components/InventoryEntryForm/InventoryEntryForm";
import { useInventoryEntryQuery } from "@/features/inventory/hooks/useInventorySummaryQuery";
import { useProductsQuery } from "@/features/products/hooks/useProductsQuery";
import { EmptyGlobal } from "@/shared/components/empty-global";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import AllUrls from "@/urls";

interface EditInventoryEntryPageProps {
  params: Promise<{ id: string }>;
}

function EditInventoryEntrySkeleton() {
  return (
    <div className="m-4 space-y-6">
      <div className="rounded-[28px] border p-6 shadow-sm">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-4 h-8 w-56" />
        <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      </div>
      <div className="rounded-[28px] border p-6 shadow-sm">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-6 h-[420px] w-full" />
      </div>
    </div>
  );
}

function entryHasMovements(
  details: Array<{
    cantidad_disponible: number;
    cantidad_inicial: number;
    consumos_venta?: Array<unknown>;
  }>
) {
  return details.some(
    (detail) =>
      Number(detail.cantidad_disponible) !== Number(detail.cantidad_inicial) ||
      (detail.consumos_venta?.length ?? 0) > 0
  );
}

export default function PageEditInventoryEntry({ params }: EditInventoryEntryPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: entry, isLoading, isError, error } = useInventoryEntryQuery(id);
  const { data: products = [] } = useProductsQuery();

  const activeProducts = products.filter((product) => product.estado === "Activo");

  if (isLoading) {
    return <EditInventoryEntrySkeleton />;
  }

  if (isError || !entry) {
    return (
      <div className="m-4">
        <EmptyGlobal
          icon={<PackagePlus className="h-12 w-12" />}
          title="No se pudo cargar el ingreso"
          description={
            error instanceof Error ? error.message : "No se encontró el ingreso solicitado."
          }
          buttonText="Volver a inventario"
          onButtonClick={() => router.push(AllUrls["system:inventory"])}
          className="border border-dashed"
        />
      </div>
    );
  }

  if (entryHasMovements(entry.detalles)) {
    return (
      <div className="m-4">
        <EmptyGlobal
          icon={<PackageCheck className="h-12 w-12" />}
          title="Este ingreso ya no se puede editar"
          description="Solo pueden editarse ingresos sin movimientos. Si el lote ya impactó stock o participó en ventas, se conserva para mantener la trazabilidad."
          buttonText="Volver a inventario"
          onButtonClick={() => router.push(AllUrls["system:inventory"])}
          className="border border-dashed"
        />
      </div>
    );
  }

  return (
    <div className="m-4 space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border bg-gradient-to-br from-amber-100 via-background to-orange-100 p-6 shadow-sm dark:from-amber-950/25 dark:via-background dark:to-orange-950/20">
        <div className="pointer-events-none absolute -left-10 top-0 h-36 w-36 rounded-full bg-amber-300/35 blur-3xl dark:bg-amber-500/10" />
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-300/30 blur-3xl dark:bg-orange-500/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/80 to-transparent dark:via-amber-500/30" />

        <div className="relative space-y-4">
          <Link
            href={AllUrls["system:inventory"]}
            className="inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a inventario
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-background/90 px-3 py-1 text-sm text-foreground/75 shadow-sm backdrop-blur dark:border-amber-900/70 dark:bg-background/80">
                <ClipboardPen className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                Editar ingreso
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Actualizar entrada de inventario
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/70 md:text-base">
                  Corrige fecha, observaciones y lotes antes de que este ingreso tenga movimientos.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="border-amber-200 bg-background/90 px-3 py-1.5 shadow-sm dark:border-amber-900/70 dark:bg-background/80"
              >
                <Tags className="mr-2 h-4 w-4" />
                {activeProducts.length.toLocaleString("es-CO")} productos activos
              </Badge>
              <Badge
                variant="outline"
                className="border-orange-200 bg-background/90 px-3 py-1.5 shadow-sm dark:border-orange-900/70 dark:bg-background/80"
              >
                <PackagePlus className="mr-2 h-4 w-4" />
                {entry.detalles.length} lote{entry.detalles.length > 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[28px] border bg-gradient-to-b from-background via-background to-amber-50/70 p-6 shadow-sm dark:to-amber-950/10">
          <div className="mb-6 flex items-center gap-3 border-b border-border/70 pb-5">
            <div className="rounded-2xl border border-amber-200 bg-amber-100 p-2.5 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-300">
              <ClipboardPen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Datos del ingreso</h2>
              <p className="text-sm text-muted-foreground">
                Mantuvimos esta vista más simple para corregir el ingreso con rapidez.
              </p>
            </div>
          </div>

          <InventoryEntryForm
            mode="edit"
            entryId={entry.id_ingreso}
            initialEntry={entry}
            onSuccess={() => {
              router.push(AllUrls["system:inventory"]);
            }}
          />

          <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
            <Link href={AllUrls["system:inventory"]}>
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" form="form-inventory-entry" className="w-full sm:w-auto">
              Guardar cambios
            </Button>
          </div>
        </section>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="overflow-hidden rounded-[28px] border bg-gradient-to-br from-amber-50 via-background to-orange-50 shadow-sm dark:from-amber-950/15 dark:via-background dark:to-orange-950/15">
            <div className="border-b border-border/70 bg-gradient-to-r from-amber-100/75 via-amber-50/50 to-orange-100/75 p-5 dark:from-amber-950/25 dark:via-background dark:to-orange-950/25">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-background/85 px-3 py-1 text-xs font-medium text-foreground/70 dark:border-amber-900/70 dark:bg-background/80">
                <Sparkles className="h-3.5 w-3.5 text-amber-700 dark:text-amber-300" />
                Edición rápida
              </div>
              <h3 className="font-semibold">Antes de guardar</h3>
              <p className="mt-1 text-sm text-foreground/70">
                Aprovecha para corregir los datos del lote. Después de que tenga movimientos, este
                ingreso quedará bloqueado para edición.
              </p>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-amber-100 bg-background/90 p-4 shadow-sm dark:border-amber-900/40">
                <p className="text-sm text-muted-foreground">Observación actual</p>
                <p className="mt-1 font-semibold">{entry.observacion || "Sin observación"}</p>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-orange-50/80 p-4 text-sm text-orange-950 dark:border-orange-900/40 dark:bg-orange-950/20 dark:text-orange-100">
                Este ingreso sigue editable porque ninguno de sus lotes ha sido consumido.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
