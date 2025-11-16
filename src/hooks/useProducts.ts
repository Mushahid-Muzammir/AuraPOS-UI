import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { PaginationParams } from "../interfaces/apiRequestInterface";
import { productService } from "../api/services/productService";
import type { CreateProduct, Product } from "../interfaces/productInterface";
import { toast } from 'sonner';

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string ) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, "search", query] as const,
  byCategory: (categoryId: string) =>
    [...productKeys.all, "category", categoryId] as const,
};

export const useProducts = (params?: PaginationParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => productService.getProductById(id),
        enabled: !!id //Only run if Id exists
    })
}

// Search products
export const useProductSearch = (query: string) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productService.getProductBySearch(query),
    enabled: query.length > 1, // Only search if query is 1+ characters
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get products by category
export const useProductsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: productKeys.byCategory(categoryId),
    queryFn: () => productService.getProductsByCategory(categoryId),
    enabled: !!categoryId,
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: CreateProduct) => productService.createProduct(product),
    
    onSuccess: (newProduct) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      
      // Optimistically update cache
      queryClient.setQueryData(productKeys.detail(newProduct.productId), newProduct);
      
      toast.success('Product created successfully!');
    },
    
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      productService.updateProduct(id, product),
    
    onMutate: async ({ id, product }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: productKeys.detail(id) });

      // Snapshot previous value
      const previousProduct = queryClient.getQueryData(productKeys.detail(id));

      // Optimistically update cache
      queryClient.setQueryData(productKeys.detail(id), (old: Product | undefined) => 
        old ? { ...old, ...product } : old
      );

      return { previousProduct };
    },
    
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success(`Product with Product Id ${updatedProduct.productId} updated successfully!`);
    },
    
    onError: (error: any, variables, context) => {
      // Rollback on error
      if (context?.previousProduct) {
        queryClient.setQueryData(
          productKeys.detail(variables.id),
          context.previousProduct
        );
      }
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      
      toast.success('Product deleted successfully!');
    },
    
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};
