import { useCallback } from "react";
import { getApiErrorMessage } from "@/shared/api/error";
import { http } from "@/shared/api/http";
import { InventoryEntry, InventorySummaryItem } from "../types/Inventory";
import { InventoryEntryFormData } from "../validations/InventoryEntrySchema";

type DeleteInventoryEntryResponse = {
  message: string;
};

export default function useInventoryServices() {
  const getInventorySummary = useCallback(async (): Promise<InventorySummaryItem[]> => {
    try {
      const response = await http.get("/inventory");
      return response.data;
    } catch (error: unknown) {
      console.error("Error en getInventorySummary:", error);
      throw new Error(getApiErrorMessage(error, "Error al obtener el resumen de inventario."));
    }
  }, []);

  const getInventoryEntries = useCallback(async (): Promise<InventoryEntry[]> => {
    try {
      const response = await http.get("/inventory/entries");
      return response.data;
    } catch (error: unknown) {
      console.error("Error en getInventoryEntries:", error);
      throw new Error(getApiErrorMessage(error, "Error al obtener los ingresos de inventario."));
    }
  }, []);

  const getInventoryEntryById = useCallback(async (id: string): Promise<InventoryEntry> => {
    try {
      const response = await http.get(`/inventory/entries/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, "Error al obtener el ingreso de inventario."));
    }
  }, []);

  const createInventoryEntry = useCallback(
    async (data: InventoryEntryFormData): Promise<InventoryEntry> => {
      try {
        const payload = {
          ...data,
          fecha_ingreso: data.fecha_ingreso || undefined,
          observacion: data.observacion || undefined,
          detalles: data.detalles.map((detail) => ({
            ...detail,
            fecha_vencimiento: detail.fecha_vencimiento || undefined,
            numero_lote_fabricacion: detail.numero_lote_fabricacion || undefined,
          })),
        };

        const response = await http.post("/inventory/entries", payload);
        return response.data;
      } catch (error: unknown) {
        console.error("Error en createInventoryEntry:", error);
        throw new Error(getApiErrorMessage(error, "Error al registrar el ingreso de inventario."));
      }
    },
    []
  );

  const updateInventoryEntry = useCallback(
    async ({ id, data }: { id: string; data: InventoryEntryFormData }): Promise<InventoryEntry> => {
      try {
        const payload = {
          ...data,
          fecha_ingreso: data.fecha_ingreso || undefined,
          observacion: data.observacion || undefined,
          detalles: data.detalles.map((detail) => ({
            ...detail,
            fecha_vencimiento: detail.fecha_vencimiento || undefined,
            numero_lote_fabricacion: detail.numero_lote_fabricacion || undefined,
          })),
        };

        const response = await http.put(`/inventory/entries/${id}`, payload);
        return response.data;
      } catch (error: unknown) {
        throw new Error(getApiErrorMessage(error, "Error al actualizar el ingreso de inventario."));
      }
    },
    []
  );

  const deleteInventoryEntry = useCallback(
    async (id: string): Promise<DeleteInventoryEntryResponse> => {
      try {
        const response = await http.delete(`/inventory/entries/${id}`);
        return response.data;
      } catch (error: unknown) {
        console.error("Error en deleteInventoryEntry:", error);
        throw new Error(getApiErrorMessage(error, "Error al eliminar el ingreso de inventario."));
      }
    },
    []
  );

  return {
    getInventorySummary,
    getInventoryEntries,
    getInventoryEntryById,
    createInventoryEntry,
    updateInventoryEntry,
    deleteInventoryEntry,
  };
}
