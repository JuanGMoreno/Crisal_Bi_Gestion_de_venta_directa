import { useQuery } from "@tanstack/react-query";
import useDashboardServices from "../services/dashboardServices";
import { DashboardSummary } from "../types/Dashboard";
import { dashboardQueryKeys } from "./dashboardQueryKeys";

export function useDashboardQuery() {
  const { getDashboard } = useDashboardServices();

  return useQuery<DashboardSummary, Error>({
    queryKey: dashboardQueryKeys.summary(),
    queryFn: getDashboard,
  });
}
