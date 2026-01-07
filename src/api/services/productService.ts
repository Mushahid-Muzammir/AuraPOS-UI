import type { ApiResponse, PaginationParams } from '../../interfaces/apiRequestInterface';
import type { CreateProduct, Product, ProductDashboardListResponse, ProductVariant } from '../../interfaces/productInterface';
import { api } from '../axios.config';
import { ApiEndpoints } from '../endpoints';


export const productService = {
    getProducts: async (params? : PaginationParams): Promise<ProductDashboardListResponse> => {
        const response = await api.get<ProductDashboardListResponse>(ApiEndpoints.GET_PRODUCTS, {params});
        return response.data;
    },

    getProductById: async(id : string): Promise<Product> => {
        const response = await api.get<ApiResponse<Product>>(ApiEndpoints.GET_PRODUCT_BY_ID(id));
        return response.data.data;
    },

    getProductsByCategory: async(categoryId: string): Promise<Product[]> => {
        const response = await api.get<ApiResponse<Product[]>>(ApiEndpoints.GET_PRODUCTS_BY_CATEGORY(categoryId));
        return response.data.data;
    },

    getProductBySearch: async(searchString : string): Promise <Product[]> => {
        const response = await api.get<ApiResponse<Product[]>>(ApiEndpoints.GET_PRODUCTS_BY_SEARCH, {params: {q: searchString}});
        return response.data.data;
    },

    createProduct: async(productData : Partial<CreateProduct>): Promise<Product> => {
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

  getProductVariantsByProductId: async (productId: string): Promise<ProductVariant[]> => {
    const response = await api.get<ApiResponse<ProductVariant[]>>(
      ApiEndpoints.GET_PRODUCT_VARIANTS(productId)
    );
    return response.data.data;
  }
  
};
