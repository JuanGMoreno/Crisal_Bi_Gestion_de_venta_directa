import { useMutation, useQueryClient } from "@tanstack/react-query";
import useProfileServices from "../services/profileServices";
import { profileQueryKeys } from "./profileQueryKeys";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { updateCurrentProfile } = useProfileServices();

  return useMutation({
    mutationFn: (payload: FormData) => updateCurrentProfile(payload),
    onSuccess: async (profile) => {
      queryClient.setQueryData(profileQueryKeys.current(), profile);
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.current() });
    },
  });
}
