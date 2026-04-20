import { useCallback } from "react";
import { getApiErrorMessage, getApiErrorStatus } from "@/shared/api/error";
import { http } from "@/shared/api/http";
import { Sale, SaleClient } from "../types/Sale";
import { SaleFormData } from "../validations/SaleSchema";

type UpdateSaleStatusPayload = {
  id: string;
  estado: "Cerrada" | "Anulada";
};

type CancelSaleResponse = {
  message: string;
  sale: Sale;
};

function normalizeSalePayload(data: SaleFormData) {
  return {
    id_cliente: data.id_cliente || undefined,
    fecha_venta: data.fecha_venta ? new Date(data.fecha_venta).toISOString() : undefined,
    estado: data.estado,
    detalles: data.detalles.map((detail) => ({
      id_producto: detail.id_producto,
      cantidad: Number(detail.cantidad),
      precio_unitario:
        detail.precio_unitario === "" ? undefined : Number(detail.precio_unitario),
      descuento_unitario: Number(detail.descuento_unitario || 0),
    })),
  };
}

export default function useSaleServices() {
  const getSales = useCallback(async (): Promise<Sale[]> => {
    try {
      const response = await http.get("/sales");
      return response.data;
    } catch (error: unknown) {
      if (getApiErrorStatus(error) === 404) {
        return [];
      }

      throw new Error(getApiErrorMessage(error, "Error al obtener las ventas."));
    }
  }, []);

  const createSale = useCallback(async (data: SaleFormData): Promise<Sale> => {
    try {
      const response = await http.post("/sales", normalizeSalePayload(data));
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, "Error al registrar la venta."));
    }
  }, []);

  const updateSaleStatus = useCallback(
    async ({ id, estado }: UpdateSaleStatusPayload): Promise<Sale> => {
      try {
        const response = await http.patch(`/sales/${id}/status`, { estado });
        return response.data;
      } catch (error: unknown) {
        throw new Error(getApiErrorMessage(error, "Error al actualizar el estado de la venta."));
      }
    },
    []
  );

  const cancelSale = useCallback(async (id: string): Promise<CancelSaleResponse> => {
    try {
      const response = await http.delete(`/sales/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, "Error al anular la venta."));
    }
  }, []);

  const getClients = useCallback(async (): Promise<SaleClient[]> => {
    try {
      const response = await http.get("/clients");
      return Array.isArray(response.data)
        ? response.data.filter((client) => client.estado === "Activo")
        : [];
    } catch (error: unknown) {
      if (getApiErrorStatus(error) === 404) {
        return [];
      }

      throw new Error(getApiErrorMessage(error, "Error al obtener los clientes."));
    }
  }, []);

  return {
    getSales,
    createSale,
    updateSaleStatus,
    cancelSale,
    getClients,
  };
}

