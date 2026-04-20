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

