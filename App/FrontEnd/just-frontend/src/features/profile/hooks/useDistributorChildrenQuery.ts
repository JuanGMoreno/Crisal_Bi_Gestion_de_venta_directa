import { useQuery } from "@tanstack/react-query";
import useProfileServices from "../services/profileServices";
import { DistributorChild } from "../types/Profile";
import { profileQueryKeys } from "./profileQueryKeys";

export function useDistributorChildrenQuery(enabled = true) {
  const { getCurrentChildren } = useProfileServices();

  return useQuery<DistributorChild[], Error>({
    queryKey: profileQueryKeys.children(),
    queryFn: getCurrentChildren,
    staleTime: 60_000,
    enabled,
  });
}
