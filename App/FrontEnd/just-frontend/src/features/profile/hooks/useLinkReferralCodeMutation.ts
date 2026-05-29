import { useMutation, useQueryClient } from "@tanstack/react-query";
import useProfileServices from "../services/profileServices";
import { profileQueryKeys } from "./profileQueryKeys";

export function useLinkReferralCodeMutation() {
  const queryClient = useQueryClient();
  const { linkReferralCode } = useProfileServices();

  return useMutation({
    mutationFn: linkReferralCode,
    onSuccess: async (profile) => {
      queryClient.setQueryData(profileQueryKeys.current(), profile);
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.current() });
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.children() });
    },
  });
}
