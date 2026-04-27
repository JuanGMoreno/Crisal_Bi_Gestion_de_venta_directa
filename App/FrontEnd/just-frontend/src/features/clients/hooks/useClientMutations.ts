import { useMutation, useQueryClient } from "@tanstack/react-query";
import useClientServices from "../services/clientServices";
import { clientQueryKeys } from "./clientQueryKeys";

export function useCreateClientMutation() {
  const queryClient = useQueryClient();
  const { createClient } = useClientServices();

  return useMutation({
    mutationFn: (payload: FormData) => createClient(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: clientQueryKeys.lists() });
    },
  });
}

export function useUpdateClientMutation() {
  const queryClient = useQueryClient();
  const { updateClient } = useClientServices();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateClient({ id, data }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: clientQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: clientQueryKeys.detail(variables.id) });
    },
  });
}

export function useDeleteClientMutation() {
  const queryClient = useQueryClient();
  const { deleteClient } = useClientServices();

  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: clientQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: clientQueryKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: clientQueryKeys.details() });
    },
  });
}
