import { useQuery } from "@tanstack/react-query";
import { productVariantService } from "../api/services/productVariantService";

export const productVariantKeys = {
    all: ["productVariants"] as const,
    allByProduct:(productId: string) => [...productVariantKeys.all, "byProduct", productId] as const,
}


export const useProductVariantsbyProductId = (productId: string) => {
    return useQuery({
        queryKey:productVariantKeys.allByProduct(productId),
        queryFn: async () => {
            const result = await productVariantService.getProductVariantsByProductId(productId);
            return result; 
        }
    })
}