import { useQuery } from '@tanstack/react-query';
import useProductServices from '../services/productServices';
import Product from '../types/Product';
import { productQueryKeys } from './productQueryKeys';


export const useProductsQuery = () => {
  const { getProducts } = useProductServices();

  return useQuery<Product[], Error>({
    queryKey: productQueryKeys.lists(),
    queryFn: getProducts,
  });

};


