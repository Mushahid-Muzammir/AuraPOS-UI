export interface ApiResponse<T>  {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiErrorResponse{
    message: string;    
    statusCode: number;
    errors?: Record<string, string[]>;
}

export interface PaginationParams {
    page?: number;
    pageSize?: number;
    cursor?: string;    
}