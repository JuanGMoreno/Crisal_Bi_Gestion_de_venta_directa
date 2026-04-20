import { useQuery } from "@tanstack/react-query";
import useInventoryServices from "../services/inventoryServices";
import { InventorySummaryItem } from "../types/Inventory";
import { inventoryQueryKeys } from "./inventoryQueryKeys";

export const useInventorySummaryQuery = () => {
  const { getInventorySummary } = useInventoryServices();

  return useQuery<InventorySummaryItem[], Error>({
    queryKey: inventoryQueryKeys.summary(),
    queryFn: getInventorySummary,
  });
};
