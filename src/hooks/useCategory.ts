import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../api/services/categoryService";


export const categoryKeys = {
  all: ["categories"] as const
};

export const useCategories = () => {
    return useQuery({
        queryKey: categoryKeys.all,
        queryFn: async () => {
            const result = await categoryService.getCategories();
            return result;
        },
        staleTime : 5*60*1000 
    })
}