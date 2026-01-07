import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { PaginationParams } from "../interfaces/apiRequestInterface";
import { salesService, type CreateSaleRequest } from "../api/services/salesService";
import type { Sale } from "../interfaces/saleInterface";
import { toast } from 'sonner';

export const salesKeys = {
  all: ["sales"] as const,
  lists: () => [...salesKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...salesKeys.lists(), params] as const,
  details: () => [...salesKeys.all, 'detail'] as const,
  detail: (id: number) => [...salesKeys.details(), id] as const,
  byDate: (startDate: string, endDate: string) =>
    [...salesKeys.all, "byDate", startDate, endDate] as const,
  report: (params?: any) => [...salesKeys.all, "report", params] as const,
};

export const useSales = (params?: PaginationParams) => {
  return useQuery({
    queryKey: salesKeys.list(params),
    queryFn: () => salesService.getSales(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useSale = (id: number) => {
  return useQuery({
    queryKey: salesKeys.detail(id),
    queryFn: () => salesService.getSaleById(id),
    enabled: !!id,
  });
};

export const useSalesByDate = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: salesKeys.byDate(startDate, endDate),
    queryFn: () => salesService.getSalesByDate(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useSalesReport = (params?: { startDate?: string; endDate?: string; period?: string }) => {
  return useQuery({
    queryKey: salesKeys.report(params),
    queryFn: () => salesService.getSalesReport(params),
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (saleData: CreateSaleRequest) => salesService.createSale(saleData),
    
    onSuccess: (newSale) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      queryClient.setQueryData(salesKeys.detail(parseInt(newSale.saleId)), newSale);
      toast.success('Sale created successfully!');
    },
    
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create sale');
    },
  });
};

