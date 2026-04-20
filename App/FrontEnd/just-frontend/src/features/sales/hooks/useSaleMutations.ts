import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryQueryKeys } from "@/features/inventory/hooks/inventoryQueryKeys";
import useSaleServices from "../services/saleServices";
import { Sale } from "../types/Sale";
import { SaleFormData } from "../validations/SaleSchema";
import { saleQueryKeys } from "./saleQueryKeys";

async function invalidateSalesRelatedQueries(queryClient: ReturnType<typeof useQueryClient>) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: saleQueryKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.summary() }),
    queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.entries() }),
  ]);
}

export function useCreateSaleMutation() {
  const { createSale } = useSaleServices();
  const queryClient = useQueryClient();

  return useMutation<Sale, Error, SaleFormData>({
    mutationFn: createSale,
    onSuccess: async () => {
      await invalidateSalesRelatedQueries(queryClient);
    },
  });
}

export function useUpdateSaleStatusMutation() {
  const { updateSaleStatus } = useSaleServices();
  const queryClient = useQueryClient();

  return useMutation<Sale, Error, { id: string; estado: "Cerrada" | "Anulada" }>({
    mutationFn: updateSaleStatus,
    onSuccess: async () => {
      await invalidateSalesRelatedQueries(queryClient);
    },
  });
}

export function useCancelSaleMutation() {
  const { cancelSale } = useSaleServices();
  const queryClient = useQueryClient();

  return useMutation<{ message: string; sale: Sale }, Error, string>({
    mutationFn: cancelSale,
    onSuccess: async () => {
      await invalidateSalesRelatedQueries(queryClient);
    },
  });
}
