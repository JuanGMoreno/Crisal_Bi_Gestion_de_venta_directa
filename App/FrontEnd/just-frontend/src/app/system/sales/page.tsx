"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import HeaderManagerSales from "@/features/sales/components/HeaderManagerSales/HeaderManagerSales";
import { SalesSummaryCards } from "@/features/sales/components/SalesSummaryCards/SalesSummaryCards";
import { createSalesColumns } from "@/features/sales/components/columns/columns";
import { SalesDataTable } from "@/features/sales/components/data-table/data-table";
import { SalesTableSkeleton } from "@/features/sales/components/data-table/SalesTableSkeleton";
import { SaleDialog } from "@/features/sales/components/SaleDialog/SaleDialog";
import { SaleDetailsDialog } from "@/features/sales/components/SaleDetailsDialog/SaleDetailsDialog";
import { UpdateSaleStatusDialog } from "@/features/sales/components/UpdateSaleStatusDialog/UpdateSaleStatusDialog";
import { useSalesQuery } from "@/features/sales/hooks/useSalesQuery";
import { Sale } from "@/features/sales/types/Sale";
import { EmptyGlobal } from "@/shared/components/empty-global";
import { Skeleton } from "@/shared/components/ui/skeleton";

function SalesSummarySkeleton() {
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

export default function PageSales() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleToClose, setSaleToClose] = useState<Sale | null>(null);
  const [saleToCancel, setSaleToCancel] = useState<Sale | null>(null);

  const {
    data: sales = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSalesQuery();

  const columns = useMemo(
    () =>
      createSalesColumns({
        onViewDetails: (sale) => setSelectedSale(sale),
        onCloseSale: (sale) => setSaleToClose(sale),
        onCancelSale: (sale) => setSaleToCancel(sale),
      }),
    []
  );

  useEffect(() => {
    if (isError) {
      toast.error(error instanceof Error ? error.message : "Error al cargar las ventas", {
        position: "top-right",
      });
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div>
        <HeaderManagerSales onCreateSale={() => setIsCreateDialogOpen(true)} />
        <SaleDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        <SalesSummarySkeleton />
        <div className="m-4">
          <SalesTableSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <HeaderManagerSales onCreateSale={() => setIsCreateDialogOpen(true)} />
        <SaleDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        <div className="m-4">
          <EmptyGlobal
            icon={<ReceiptText className="h-12 w-12" />}
            title="No se pudieron cargar las ventas"
            description={error instanceof Error ? error.message : "Ocurrio un error inesperado."}
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
      <HeaderManagerSales onCreateSale={() => setIsCreateDialogOpen(true)} />

      <SaleDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <SaleDetailsDialog sale={selectedSale} onClose={() => setSelectedSale(null)} />
      <UpdateSaleStatusDialog
        sale={saleToClose}
        mode="close"
        onClose={() => setSaleToClose(null)}
      />
      <UpdateSaleStatusDialog
        sale={saleToCancel}
        mode="cancel"
        onClose={() => setSaleToCancel(null)}
      />

      {sales.length > 0 ? (
        <SalesSummaryCards sales={sales} />
      ) : (
        <div className="m-4 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
          Aun no hay ventas registradas para mostrar el resumen.
        </div>
      )}

      <div className="m-4">
        {isFetching ? (
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Actualizando ventas...
          </div>
        ) : null}

        {sales.length === 0 ? (
          <EmptyGlobal
            icon={<ReceiptText className="h-12 w-12" />}
            title="No se han registrado ventas"
            description="Cuando registres tu primera venta, aqui podras consultar productos, clientes y estados."
            buttonText="Registrar venta"
            onButtonClick={() => setIsCreateDialogOpen(true)}
            className="border border-dashed"
          />
        ) : (
          <SalesDataTable columns={columns} data={sales} />
        )}
      </div>
    </div>
  );
}
