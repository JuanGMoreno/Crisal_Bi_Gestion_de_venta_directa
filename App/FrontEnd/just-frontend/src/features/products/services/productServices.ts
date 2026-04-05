
import { useCallback } from "react";
import { http } from "@/shared/api/http";
import { getApiErrorMessage, getApiErrorStatus } from "@/shared/api/error";
import Product from "../types/Product";

export default function useProductServices() {
  const getProducts = useCallback(async (): Promise<Product[]> => {
    try {
      const response = await http.get("/products");
      return response.data;
    } catch (error: unknown) {
      // El backend responde 404 cuando no hay productos activos.
      if (getApiErrorStatus(error) === 404) {
        return [];
      }

      console.error("Error en getProducts:", error);
      throw new Error(getApiErrorMessage(error, "Error al obtener los productos."));
    }
  }, []);

  const getProductById = useCallback(async (id: string): Promise<Product> => {
    try {
      const response = await http.get(`/products/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error en getProductById:", error);
      throw new Error(getApiErrorMessage(error, "Error al obtener el producto."));
    }
  }, []);

  const createProduct = useCallback(async (data: Omit<Product, "id_producto">): Promise<Product> => {
    try {
      const response = await http.post("/products", data);
      return response.data;
    } catch (error: unknown) {
      console.error("Error en createProduct:", error);
      throw new Error(getApiErrorMessage(error, "Error al crear el producto."));
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<Omit<Product, "id_producto">>): Promise<Product> => {
    try {
      const response = await http.put(`/products/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      console.error("Error en updateProduct:", error);
      throw new Error(getApiErrorMessage(error, "Error al actualizar el producto."));
    }
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<{ message: string }> => {
    try {
      const response = await http.delete(`/products/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error en deleteProduct:", error);
      throw new Error(getApiErrorMessage(error, "Error al eliminar el producto."));
    }
  }, []);


  return {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
