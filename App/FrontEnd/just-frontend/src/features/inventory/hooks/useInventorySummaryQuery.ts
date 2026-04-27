import { useQuery } from "@tanstack/react-query";
import useInventoryServices from "../services/inventoryServices";
import { InventoryEntry, InventorySummaryItem } from "../types/Inventory";
import { inventoryQueryKeys } from "./inventoryQueryKeys";

export const useInventorySummaryQuery = () => {
  const { getInventorySummary } = useInventoryServices();

  return useQuery<InventorySummaryItem[], Error>({
    queryKey: inventoryQueryKeys.summary(),
    queryFn: getInventorySummary,
  });
};

export const useInventoryEntryQuery = (id: string) => {
  const { getInventoryEntryById } = useInventoryServices();

  return useQuery<InventoryEntry, Error>({
    queryKey: inventoryQueryKeys.detail(id),
    queryFn: () => getInventoryEntryById(id),
    enabled: Boolean(id),
  });
};
