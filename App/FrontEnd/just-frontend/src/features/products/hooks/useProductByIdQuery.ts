import { useQuery } from "@tanstack/react-query";
import useProductServices from "../services/productServices";
import Product from "../types/Product";
import { productQueryKeys } from "./productQueryKeys";

export const useProductByIdQuery = (id: string | undefined) => {
  const { getProductById } = useProductServices();

  return useQuery<Product, Error>({
    queryKey: productQueryKeys.detail(id ?? ""),
    // enabled evita requests cuando el id todavia no esta disponible.
    enabled: Boolean(id),
    queryFn: async () => {
      // Guard clause defensiva: no deberia ejecutarse con enabled=false,
      // pero mantenemos un error claro por seguridad.
      if (!id) {
        throw new Error("El id del producto es requerido para consultar el detalle.");
      }

      return getProductById(id);
    },
  });
};
