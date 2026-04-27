import { useQuery } from "@tanstack/react-query";
import { DistributorProfile } from "../types/Profile";
import { profileQueryKeys } from "./profileQueryKeys";
import useProfileServices from "../services/profileServices";

export function useProfileQuery() {
  const { getCurrentProfile } = useProfileServices();

  return useQuery<DistributorProfile, Error>({
    queryKey: profileQueryKeys.current(),
    queryFn: getCurrentProfile,
    staleTime: 60_000,
  });
}
