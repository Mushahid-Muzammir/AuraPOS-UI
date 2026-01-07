import type { ApiResponse, PaginationParams } from "../../interfaces/apiRequestInterface";
import type {  Customer, NewCustomer } from "../../interfaces/customerInterface";
import { api } from "../axios.config";
import { ApiEndpoints } from "../endpoints";

export const customerService = {
    //Partial Makes all properties in <T> optional

    getCustomers: async (params? : PaginationParams): Promise<Customer[]> => {
        const response = await api.get<Customer[]>(ApiEndpoints.GET_CUSTOMERS, {params});
        console.log("Customer Response", response);
        return response.data;
    },

    getCustomerById: async(customerId : string): Promise<Customer> => {
        const response = await api.get<ApiResponse<Customer>>(ApiEndpoints.GET_CUSTOMER_BY_ID(customerId));
        return response.data.data;
    },

    createCustomer: async (customerData : Partial<NewCustomer>) :Promise<Customer> => {
        const response = await api.post<ApiResponse<Customer>>(ApiEndpoints.CREATE_CUSTOMER, customerData);
        return response.data.data;
    },

    getCustomerBySearch: async(searchString: string) :Promise<Customer[]> => {
        const response = await api.get<ApiResponse<Customer[]>>(ApiEndpoints.GET_CUSTOMER_BY_SEARCH, {params: {q: searchString}});
        return response.data.data;
    },

    updateCustomer: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
        const response = await api.put<ApiResponse<Customer>>(
          ApiEndpoints.UPDATE_CUSTOMER(id),
          customer
        );
        return response.data.data;
      },
    
        deleteCustomer: async (id: string): Promise<void> => {
        await api.delete(ApiEndpoints.DELETE_CUSTOMER(id));
      },
}