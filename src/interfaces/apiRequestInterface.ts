export interface ApiResponse<T>  {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError  {
    message: string;
    code?: string;
    details?: any;
}

export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}