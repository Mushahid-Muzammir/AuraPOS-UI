export const ApiEndpoints = {
    GET_PRODUCTS: '/api/products',
    GET_PRODUCT_BY_ID: (id : string) => `/api/products/${id}`,
    GET_PRODUCTS_BY_CATEGORY: (categoryId : string) => `/api/products/${categoryId}`,
    GET_PRODUCTS_BY_SEARCH: '/api/products/search',
    CREATE_PRODUCT: '/api/products',
    UPDATE_PRODUCT: (id : string) => `/api/products/${id}`,
    DELETE_PRODUCT: (id : string) => `/api/products/${id}`,

    GET_SALES: '/sales',
    GET_SALE_BY_ID: (id: number) => `/sales/${id}`,
    GET_SALES_BY_DATE: '/sales/by-date',
    GET_SALES_REPORT: '/sales/report',

    GET_CUSTOMERS: '/customers',
    GET_CUSTOMER_BY_ID: (id: string) => `/customers/${id}`,
    GET_CUSTOMER_BY_SEARCH : `api/customers/search`,
    CREATE_CUSTOMER: '/customers',
    UPDATE_CUSTOMER: (id: string) => `/customers/${id}`,
    DELETE_CUSTOMER: (id: string) => `/customers/${id}`,

    GET_CHEQUES: '/cheques',
    GET_CHEQUE_BY_ID: (id: number) => `/cheques/${id}`,
    CREATE_CHEQUE: '/cheques',
    UPDATE_CHEQUE: (id: number) => `/cheques/${id}`,
    DELETE_CHEQUE: (id: number) => `/cheques/${id}`,

    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
} as const;