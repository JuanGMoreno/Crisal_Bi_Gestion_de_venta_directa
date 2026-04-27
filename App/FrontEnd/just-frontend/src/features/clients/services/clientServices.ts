import { useCallback } from "react";
import { getApiErrorMessage, getApiErrorStatus } from "@/shared/api/error";
import { http } from "@/shared/api/http";
import { Client } from "../types/Client";

type DeleteClientResponse = {
  message: string;
  client: Client;
};

export default function useClientServices() {
  const getClients = useCallback(async (): Promise<Client[]> => {
    try {
      const response = await http.get("/clients");
      return response.data;
    } catch (error: unknown) {
      if (getApiErrorStatus(error) === 404) {
        return [];
      }

      throw new Error(getApiErrorMessage(error, "Error al obtener los clientes."));
    }
  }, []);

  const createClient = useCallback(async (data: FormData): Promise<Client> => {
    try {
      const response = await http.post("/clients", data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, "Error al registrar el cliente."));
    }
  }, []);

  const updateClient = useCallback(
    async ({ id, data }: { id: string; data: FormData }): Promise<Client> => {
      try {
        const response = await http.put(`/clients/${id}`, data);
        return response.data;
      } catch (error: unknown) {
        throw new Error(getApiErrorMessage(error, "Error al actualizar el cliente."));
      }
    },
    []
  );

  const deleteClient = useCallback(async (id: string): Promise<DeleteClientResponse> => {
    try {
      const response = await http.delete(`/clients/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, "Error al eliminar el cliente."));
    }
  }, []);

  return {
    getClients,
    createClient,
    updateClient,
    deleteClient,
  };
}
