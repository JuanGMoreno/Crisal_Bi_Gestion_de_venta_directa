import { useQuery } from "@tanstack/react-query";
import useInventoryServices from "../services/inventoryServices";
import { InventoryEntry } from "../types/Inventory";
import { inventoryQueryKeys } from "./inventoryQueryKeys";

export const useInventoryEntriesQuery = () => {
  const { getInventoryEntries } = useInventoryServices();

  return useQuery<InventoryEntry[], Error>({
    queryKey: inventoryQueryKeys.entries(),
    queryFn: getInventoryEntries,
  });
};
