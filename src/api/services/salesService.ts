import type { ApiResponse, PaginationParams } from '../../interfaces/apiRequestInterface';
import type { Sale } from '../../interfaces/saleInterface';
import { api } from '../axios.config';
import { ApiEndpoints } from '../endpoints';

export interface CreateSaleRequest {
  customerId?: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  subTotal: number;
  discountPercentage?: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount: number;
  paymentMethod: string;
  paidAmount: number;
  changeGiven?: number;
}

export interface SalesListResponse {
  sales: Sale[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SalesReportResponse {
  totalSales: number;
  totalRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  period: string;
}

export const salesService = {
  getSales: async (params?: PaginationParams): Promise<SalesListResponse> => {
    const response = await api.get<ApiResponse<SalesListResponse>>(ApiEndpoints.GET_SALES, { params });
    return response.data.data;
  },

  getSaleById: async (id: number): Promise<Sale> => {
    const response = await api.get<ApiResponse<Sale>>(ApiEndpoints.GET_SALE_BY_ID(id));
    return response.data.data;
  },

  getSalesByDate: async (startDate: string, endDate: string): Promise<Sale[]> => {
    const response = await api.get<ApiResponse<Sale[]>>(ApiEndpoints.GET_SALES_BY_DATE, {
      params: { startDate, endDate }
    });
    return response.data.data;
  },

  getSalesReport: async (params?: { startDate?: string; endDate?: string; period?: string }): Promise<SalesReportResponse> => {
    const response = await api.get<ApiResponse<SalesReportResponse>>(ApiEndpoints.GET_SALES_REPORT, { params });
    return response.data.data;
  },

  createSale: async (saleData: CreateSaleRequest): Promise<Sale> => {
    const response = await api.post<ApiResponse<Sale>>(ApiEndpoints.CREATE_SALE, saleData);
    return response.data.data;
  },
};

