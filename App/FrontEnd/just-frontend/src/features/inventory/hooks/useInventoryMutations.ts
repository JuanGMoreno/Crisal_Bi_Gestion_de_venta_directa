import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInventoryServices from "../services/inventoryServices";
import { inventoryQueryKeys } from "./inventoryQueryKeys";
import { InventoryEntryFormData } from "../validations/InventoryEntrySchema";

export const useCreateInventoryEntryMutation = () => {
  const queryClient = useQueryClient();
  const { createInventoryEntry } = useInventoryServices();

  return useMutation({
    mutationFn: (payload: InventoryEntryFormData) => createInventoryEntry(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.summary() });
      await queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.entries() });
    },
  });
};

export const useUpdateInventoryEntryMutation = () => {
  const queryClient = useQueryClient();
  const { updateInventoryEntry } = useInventoryServices();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InventoryEntryFormData }) =>
      updateInventoryEntry({ id, data }),
    onSuccess: async (entry) => {
      await queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.summary() });
      await queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.entries() });
      await queryClient.invalidateQueries({
        queryKey: inventoryQueryKeys.detail(entry.id_ingreso),
      });
    },
  });
};

export const useDeleteInventoryEntryMutation = () => {
  const queryClient = useQueryClient();
  const { deleteInventoryEntry } = useInventoryServices();

  return useMutation({
    mutationFn: (id: string) => deleteInventoryEntry(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.summary() });
      await queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.entries() });
    },
  });
};
