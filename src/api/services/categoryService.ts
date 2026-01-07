import type { Category } from "../../interfaces/categoryInterface";
import { api } from "../axios.config";
import { ApiEndpoints } from "../endpoints";


export const categoryService = {
    getCategories: async(): Promise<Category[]> => {
        const response = await api.get<Category[]>(ApiEndpoints.GET_CATEGORIES);
        return response.data;
    }
}