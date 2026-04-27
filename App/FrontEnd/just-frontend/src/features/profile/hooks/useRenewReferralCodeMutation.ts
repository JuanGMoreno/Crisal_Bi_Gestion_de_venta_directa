import { useMutation, useQueryClient } from "@tanstack/react-query";
import useProfileServices from "../services/profileServices";
import { profileQueryKeys } from "./profileQueryKeys";

export function useRenewReferralCodeMutation() {
  const queryClient = useQueryClient();
  const { renewReferralCode } = useProfileServices();

  return useMutation({
    mutationFn: renewReferralCode,
    onSuccess: async (profile) => {
      queryClient.setQueryData(profileQueryKeys.current(), profile);
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.current() });
    },
  });
}
