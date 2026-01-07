import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { PaginationParams } from "../interfaces/apiRequestInterface";
import { customerService } from "../api/services/customerService";
import type { Customer, NewCustomer } from "../interfaces/customerInterface";
import { toast } from 'sonner';

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  search: (query: string) => [...customerKeys.all, "search", query] as const,
};

export const useCustomers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerService.getCustomers(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
  });
};

export const useCustomerSearch = (query: string) => {
  return useQuery({
    queryKey: customerKeys.search(query),
    queryFn: () => customerService.getCustomerBySearch(query),
    enabled: query.length > 1,
    staleTime: 30 * 1000,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: NewCustomer) => customerService.createCustomer(customer),
    
    onSuccess: (newCustomer) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.setQueryData(customerKeys.detail(newCustomer.customerId), newCustomer);
      toast.success('Customer created successfully!');
    },
    
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create customer');
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customer }: { id: string; customer: Partial<Customer> }) =>
      customerService.updateCustomer(id, customer),
    
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.setQueryData(customerKeys.detail(updatedCustomer.customerId), updatedCustomer);
      toast.success('Customer updated successfully!');
    },
    
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update customer');
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: customerKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Customer deleted successfully!');
    },
    
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete customer');
    },
  });
};

