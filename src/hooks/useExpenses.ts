import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { PaginationParams } from "../interfaces/apiRequestInterface";
import { expenseService, type CreateExpenseRequest } from "../api/services/expenseService";
import type { Expense } from "../interfaces/expenseInterface";
import { toast } from 'sonner';

export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...expenseKeys.lists(), params] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: number) => [...expenseKeys.details(), id] as const,
};

export const useExpenses = (params?: PaginationParams) => {
  return useQuery({
    queryKey: expenseKeys.list(params),
    queryFn: () => expenseService.getExpenses(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useExpense = (id: number) => {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => expenseService.getExpenseById(id),
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expense: CreateExpenseRequest) => expenseService.createExpense(expense),
    
    onSuccess: (newExpense) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.setQueryData(expenseKeys.detail(newExpense.id), newExpense);
      toast.success('Expense added successfully!');
    },
    
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create expense');
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, expense }: { id: number; expense: Partial<Expense> }) =>
      expenseService.updateExpense(id, expense),
    
    onSuccess: (updatedExpense) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.setQueryData(expenseKeys.detail(updatedExpense.id), updatedExpense);
      toast.success('Expense updated successfully!');
    },
    
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update expense');
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => expenseService.deleteExpense(id),
    
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: expenseKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      toast.success('Expense deleted successfully!');
    },
    
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete expense');
    },
  });
};

