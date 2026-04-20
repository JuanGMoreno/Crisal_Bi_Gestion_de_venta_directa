import { useMutation, useQueryClient } from "@tanstack/react-query";
import useProductServices from "../services/productServices";
import { productQueryKeys } from "./productQueryKeys";

export type CreateProductInput = FormData;
export type UpdateProductInput = {
  id: string;
  data: FormData;
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  const { createProduct } = useProductServices();

  return useMutation({
    mutationFn: (payload: CreateProductInput) => createProduct(payload),
    onSuccess: async () => {
      // Al crear, invalidamos la lista para que el table haga fetch fresco.
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  const { updateProduct } = useProductServices();

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductInput) => updateProduct(id, data),
    onSuccess: async (_, variables) => {
      // Refresca lista y detalle afectado para mantener cache consistente.
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(variables.id) });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  const { deleteProduct } = useProductServices();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: async (_, deletedId) => {
      // En delete invalidamos lista y detalle por si esa vista sigue abierta.
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(deletedId) });
      // Tambien marcamos el namespace de detalles para evitar cache stale residual.
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.details() });
    },
  });
};
