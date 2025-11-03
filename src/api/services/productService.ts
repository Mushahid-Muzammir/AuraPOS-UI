import type { ApiResponse, PaginationParams } from '../../datatypes/apiTypes';
import type { Product, ProductListResponse } from '../../datatypes/productType';
import { api } from '../axios.config';
import { ApiEndpoints } from '../endpoints';


export const productService = {
    getProducts: async (params? : PaginationParams): Promise<ProductListResponse> => {
        const response = await api.get<ApiResponse<ProductListResponse>>(ApiEndpoints.GET_PRODUCTS, {params});
        return response.data.data;
    },

    getProductById: async(id : string): Promise<Product> => {
        const response = await api.get<ApiResponse<Product>>(ApiEndpoints.GET_PRODUCT_BY_ID(id));
        return response.data.data;
    },

    getByCategory: async(categoryId: string): Promise<Product[]> => {
        const response = await api.get<ApiResponse<Product[]>>(ApiEndpoints.GET_PRODUCTS_BY_CATEGORY(categoryId));
        return response.data.data;
    },

    getBySearch: async(search : string): Promise <Product[]> => {
        const response = await api.get<ApiResponse<Product[]>>(ApiEndpoints.GET_PRODUCTS_BY_SEARCH, {params: {q: search}});
        return response.data.data;
    },

    createProduct: async(productData : Partial<Product>): Promise<Product> => {
        const response = await api.post<ApiResponse<Product>>(ApiEndpoints.CREATE_PRODUCT, productData);
        return response.data.data;
    },

    updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(
      ApiEndpoints.UPDATE_PRODUCT(id),
      product
    );
    return response.data.data;
  },

    deleteProduct: async (id: string): Promise<void> => {
    await api.delete(ApiEndpoints.DELETE_PRODUCT(id));
  },
};
