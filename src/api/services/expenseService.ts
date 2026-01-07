import type { ApiResponse, PaginationParams } from '../../interfaces/apiRequestInterface';
import type { Expense } from '../../interfaces/expenseInterface';
import { api } from '../axios.config';
import { ApiEndpoints } from '../endpoints';

export interface ExpenseListResponse {
  expenses: Expense[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateExpenseRequest {
  description: string;
  amount: number;
  date: string;
  category?: string;
  receiptUrl?: string;
}

export const expenseService = {
  getExpenses: async (params?: PaginationParams): Promise<ExpenseListResponse> => {
    const response = await api.get<ApiResponse<ExpenseListResponse>>(ApiEndpoints.GET_EXPENSES, { params });
    return response.data.data;
  },

  getExpenseById: async (id: number): Promise<Expense> => {
    const response = await api.get<ApiResponse<Expense>>(ApiEndpoints.GET_EXPENSE_BY_ID(id));
    return response.data.data;
  },

  createExpense: async (expenseData: CreateExpenseRequest): Promise<Expense> => {
    const response = await api.post<ApiResponse<Expense>>(ApiEndpoints.CREATE_EXPENSE, expenseData);
    return response.data.data;
  },

  updateExpense: async (id: number, expense: Partial<Expense>): Promise<Expense> => {
    const response = await api.put<ApiResponse<Expense>>(
      ApiEndpoints.UPDATE_EXPENSE(id),
      expense
    );
    return response.data.data;
  },

  deleteExpense: async (id: number): Promise<void> => {
    await api.delete(ApiEndpoints.DELETE_EXPENSE(id));
  },
};

