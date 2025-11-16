import { api } from "../axios.config";
import { ApiEndpoints } from "../endpoints";
import type { ApiResponse, PaginationParams } from "../../interfaces/apiRequestInterface";
import type { Employee } from "../../interfaces/employeeInterface";



export const employeeService = {
    getCustomers: async (params? : PaginationParams): Promise<Employee> => {
            const response = await api.get<ApiResponse<Employee>>(ApiEndpoints.GET_CUSTOMERS, {params});
            return response.data.data;
        },
    
        getCustomerById: async(customerId : string): Promise<Employee> => {
            const response = await api.get<ApiResponse<Employee>>(ApiEndpoints.GET_CUSTOMER_BY_ID(customerId));
            return response.data.data;
        },
    
        createCustomer: async (customerData : Partial<Employee>) :Promise<Employee> => {
            const response = await api.post<ApiResponse<Employee>>(ApiEndpoints.CREATE_CUSTOMER, customerData);
            return response.data.data;
        },
    
        getCustomerBySearch: async(searchString: string) :Promise<Employee[]> => {
            const response = await api.get<ApiResponse<Employee[]>>(ApiEndpoints.GET_CUSTOMER_BY_SEARCH, {params: {q: searchString}});
            return response.data.data;
        },
    
        updateCustomer: async (id: string, customer: Partial<Employee>): Promise<Employee> => {
            const response = await api.put<ApiResponse<Employee>>(
              ApiEndpoints.UPDATE_CUSTOMER(id),
              customer
            );
            return response.data.data;
          },
        
            deleteProduct: async (id: string): Promise<void> => {
            await api.delete(ApiEndpoints.DELETE_CUSTOMER(id));
          },

}