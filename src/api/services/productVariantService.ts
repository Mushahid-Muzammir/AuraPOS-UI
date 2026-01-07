import type { ProductVariant } from "../../interfaces/productInterface";
import { api } from "../axios.config";
import { ApiEndpoints } from "../endpoints";

export const productVariantService = {
    getProductVariantsByProductId: async(productId: string): Promise<ProductVariant[]> => {
        const response = await api.get<ProductVariant[]>(ApiEndpoints.GET_PRODUCT_VARIANTS(productId));
        return response.data;
    }
}