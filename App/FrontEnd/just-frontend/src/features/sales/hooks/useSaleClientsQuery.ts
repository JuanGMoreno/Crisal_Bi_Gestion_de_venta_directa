import { useQuery } from "@tanstack/react-query";
import useSaleServices from "../services/saleServices";
import { SaleClient } from "../types/Sale";
import { saleQueryKeys } from "./saleQueryKeys";

export function useSaleClientsQuery() {
  const { getClients } = useSaleServices();

  return useQuery<SaleClient[], Error>({
    queryKey: saleQueryKeys.clients(),
    queryFn: getClients,
  });
}

