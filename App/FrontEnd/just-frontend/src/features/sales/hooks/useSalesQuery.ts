import { useQuery } from "@tanstack/react-query";
import useSaleServices from "../services/saleServices";
import { Sale } from "../types/Sale";
import { saleQueryKeys } from "./saleQueryKeys";

export function useSalesQuery() {
  const { getSales } = useSaleServices();

  return useQuery<Sale[], Error>({
    queryKey: saleQueryKeys.lists(),
    queryFn: getSales,
  });
}

export function useSaleQuery(id: string) {
  const { getSaleById } = useSaleServices();

  return useQuery<Sale, Error>({
    queryKey: saleQueryKeys.detail(id),
    queryFn: () => getSaleById(id),
    enabled: Boolean(id),
  });
}

