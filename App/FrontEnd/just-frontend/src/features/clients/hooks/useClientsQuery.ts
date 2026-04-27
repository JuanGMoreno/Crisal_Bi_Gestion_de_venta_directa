import { useQuery } from "@tanstack/react-query";
import useClientServices from "../services/clientServices";
import { Client } from "../types/Client";
import { clientQueryKeys } from "./clientQueryKeys";

export function useClientsQuery() {
  const { getClients } = useClientServices();

  return useQuery<Client[], Error>({
    queryKey: clientQueryKeys.lists(),
    queryFn: getClients,
  });
}
