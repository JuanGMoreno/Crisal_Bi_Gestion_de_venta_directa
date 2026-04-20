"use client";

import { useEffect, useMemo, useState } from "react";
import { Boxes, Loader2, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import HeaderManagerInventory from "@/features/inventory/components/HeaderManagerInventory/HeaderManagerInventory";
import { InventorySummaryCards } from "@/features/inventory/components/InventorySummaryCards/InventorySummaryCards";
import { InventorySummaryTable } from "@/features/inventory/components/InventorySummaryTable/InventorySummaryTable";
import { createInventoryColumns } from "@/features/inventory/components/columns/columns";
import { InventoryDataTable } from "@/features/inventory/components/data-table/data-table";
import { InventoryTableSkeleton } from "@/features/inventory/components/data-table/InventoryTableSkeleton";
import { InventoryEntryDialog } from "@/features/inventory/components/InventoryEntryDialog/InventoryEntryDialog";
import { InventoryEntryDetailsDialog } from "@/features/inventory/components/InventoryEntryDetailsDialog/InventoryEntryDetailsDialog";
import { DeleteInventoryEntryDialog } from "@/features/inventory/components/DeleteInventoryEntryDialog/DeleteInventoryEntryDialog";
import { useInventoryEntriesQuery } from "@/features/inventory/hooks/useInventoryEntriesQuery";
import { useInventorySummaryQuery } from "@/features/inventory/hooks/useInventorySummaryQuery";
import { InventoryEntry } from "@/features/inventory/types/Inventory";
import { EmptyGlobal } from "@/shared/components/empty-global";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

function InventorySummarySkeleton() {
  return (
    <div className="m-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-2xl border p-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-8 w-36" />
          <Skeleton className="mt-5 h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function PageInventory() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<InventoryEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<InventoryEntry | null>(null);
  const [activeView, setActiveView] = useState<"products" | "entries">("products");

  const {
    data: inventorySummary = [],
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
    isError: isSummaryError,
    error: summaryError,
    refetch: refetchSummary,
  } = useInventorySummaryQuery();

  const {
    data: inventoryEntries = [],
    isLoading: isEntriesLoading,
    isFetching: isEntriesFetching,
    isError: isEntriesError,
    error: entriesError,
    refetch: refetchEntries,
  } = useInventoryEntriesQuery();

  const columns = useMemo(
    () =>
      createInventoryColumns({
        onViewDetails: (entry) => setSelectedEntry(entry),
        onDelete: (entry) => setEntryToDelete(entry),
      }),
    []
  );

  useEffect(() => {
    if (isSummaryError) {
      toast.error(
        summaryError instanceof Error
          ? summaryError.message
          : "No se pudo cargar el resumen del inventario",
        { position: "top-right" }
      );
    }
  }, [isSummaryError, summaryError]);

  useEffect(() => {
    if (isEntriesError) {
      toast.error(
        entriesError instanceof Error
          ? entriesError.message
          : "No se pudieron cargar los ingresos de inventario",
        { position: "top-right" }
      );
    }
  }, [isEntriesError, entriesError]);

  const handleRetry = () => {
    void refetchSummary();
    void refetchEntries();
  };

  const isLoading = isSummaryLoading || isEntriesLoading;
  const isRefreshing = isSummaryFetching || isEntriesFetching;
  const hasError = isSummaryError || isEntriesError;

  if (isLoading) {
    return (
      <div>
        <HeaderManagerInventory onCreateEntry={() => setIsCreateDialogOpen(true)} />
        <InventoryEntryDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
        <InventorySummarySkeleton />
        <div className="m-4">
          <InventoryTableSkeleton />
        </div>
      </div>
    );
  }

  if (hasError) {
    const errorMessage =
      summaryError instanceof Error
        ? summaryError.message
        : entriesError instanceof Error
          ? entriesError.message
          : "Ocurrio un error inesperado al cargar el inventario.";

    return (
      <div>
        <HeaderManagerInventory onCreateEntry={() => setIsCreateDialogOpen(true)} />
        <InventoryEntryDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
        <div className="m-4">
          <EmptyGlobal
            icon={<Boxes className="h-12 w-12" />}
            title="No se pudo cargar el inventario"
            description={errorMessage}
            buttonText="Reintentar"
            onButtonClick={handleRetry}
            className="border border-dashed"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeaderManagerInventory onCreateEntry={() => setIsCreateDialogOpen(true)} />

      <InventoryEntryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <InventoryEntryDetailsDialog
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
      <DeleteInventoryEntryDialog
        entry={entryToDelete}
        onClose={() => setEntryToDelete(null)}
      />

      {inventorySummary.length > 0 ? (
        <InventorySummaryCards items={inventorySummary} />
      ) : (
        <div className="m-4 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
          Aun no hay stock disponible para mostrar el resumen del inventario.
        </div>
      )}

      <div className="m-4">
        {isRefreshing ? (
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Actualizando inventario...
          </div>
        ) : null}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/20 p-3">
          <div>
            <h3 className="text-base font-semibold">Vista del inventario</h3>
            <p className="text-sm text-muted-foreground">
              Alterna entre el stock actual por producto y el historial de ingresos registrados.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === "products" ? "default" : "outline"}
              onClick={() => setActiveView("products")}
            >
              Stock por producto
            </Button>
            <Button
              variant={activeView === "entries" ? "default" : "outline"}
              onClick={() => setActiveView("entries")}
            >
              Ingresos registrados
            </Button>
          </div>
        </div>

        {activeView === "products" && inventorySummary.length === 0 ? (
          <EmptyGlobal
            icon={<Boxes className="h-12 w-12" />}
            title="No hay stock disponible"
            description="Cuando registres ingresos, aqui podras consultar cuanto te queda de cada producto."
            buttonText="Registrar ingreso"
            onButtonClick={() => setIsCreateDialogOpen(true)}
            className="border border-dashed"
          />
        ) : null}

        {activeView === "entries" && inventoryEntries.length === 0 ? (
          <EmptyGlobal
            icon={<PackageSearch className="h-12 w-12" />}
            title="No se han registrado ingresos"
            description="Cuando registres tu primer ingreso, aqui podras revisar cantidades, costos y vencimientos."
            buttonText="Registrar ingreso"
            onButtonClick={() => setIsCreateDialogOpen(true)}
            className="border border-dashed"
          />
        ) : null}

        {activeView === "products" && inventorySummary.length > 0 ? (
          <InventorySummaryTable data={inventorySummary} />
        ) : null}

        {activeView === "entries" && inventoryEntries.length > 0 ? (
          <InventoryDataTable columns={columns} data={inventoryEntries} />
        ) : null}
      </div>
    </div>
  );
}
