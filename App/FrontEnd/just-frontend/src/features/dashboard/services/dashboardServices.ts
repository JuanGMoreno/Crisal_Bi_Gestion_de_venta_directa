import { useCallback } from "react";
import { getApiErrorMessage } from "@/shared/api/error";
import { http } from "@/shared/api/http";
import { DashboardSummary } from "../types/Dashboard";

export default function useDashboardServices() {
  const getDashboard = useCallback(async (): Promise<DashboardSummary> => {
    try {
      const response = await http.get("/dashboard");
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getApiErrorMessage(error, "Error al obtener el panel de control.")
      );
    }
  }, []);

  return {
    getDashboard,
  };
}
