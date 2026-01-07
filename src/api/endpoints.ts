export const ApiEndpoints = {
    // Product endpoints - .NET controller: Product
    GET_PRODUCTS: '/api/Product',
    GET_PRODUCT_BY_ID: (id : string) => `/api/Product/${id}`,
    GET_PRODUCTS_BY_CATEGORY: (categoryId : string) => `/api/Product/category/${categoryId}`,
    GET_PRODUCTS_BY_SEARCH: '/api/Product/search',
    CREATE_PRODUCT: '/api/Product',
    UPDATE_PRODUCT: (id : string) => `/api/Product/${id}`,
    DELETE_PRODUCT: (id : string) => `/api/Product/${id}`,
    GET_PRODUCT_VARIANTS: (productId: string) => `/api/ProductVariant/product/${productId}`,

    // Sale endpoints - .NET controller: Sale
    GET_SALES: '/api/Sale',
    GET_SALE_BY_ID: (id: number) => `/api/Sale/${id}`,
    GET_SALES_BY_DATE: '/api/Sale/by-date',
    GET_SALES_REPORT: '/api/Sale/report',
    CREATE_SALE: '/api/Sale',


    // Customer endpoints - .NET controller: Customer
    GET_CUSTOMERS: '/api/Customer',
    GET_CUSTOMER_BY_ID: (id: string) => `/api/Customer/${id}`,
    GET_CUSTOMER_BY_SEARCH: '/api/Customer/search',
    CREATE_CUSTOMER: '/api/Customer',
    UPDATE_CUSTOMER: (id: string) => `/api/Customer/${id}`,
    DELETE_CUSTOMER: (id: string) => `/api/Customer/${id}`,

    // Expense endpoints - .NET controller: Expense
    GET_EXPENSES: '/api/Expense',
    GET_EXPENSE_BY_ID: (id: number) => `/api/Expense/${id}`,
    CREATE_EXPENSE: '/api/Expense',
    UPDATE_EXPENSE: (id: number) => `/api/Expense/${id}`,
    DELETE_EXPENSE: (id: number) => `/api/Expense/${id}`,

    // Employee endpoints - .NET controller: Employee
    GET_EMPLOYEES: '/api/Employee',
    GET_EMPLOYEES_FOR_LOGIN: '/api/Employee/EmployeeLogin',
    GET_EMPLOYEE_BY_ID: (id: string) => `/api/Employee/${id}`,
    CREATE_EMPLOYEE: '/api/Employee',
    UPDATE_EMPLOYEE: (id: string) => `/api/Employee/${id}`,
    DELETE_EMPLOYEE: (id: string) => `/api/Employee/${id}`,

    // Category endpoints - .NET controller: Category
    GET_CATEGORIES: '/api/Category',
    GET_CATEGORY_BY_ID: (id: number) => `/api/Category/${id}`,
    CREATE_CATEGORY: '/api/Category',
    UPDATE_CATEGORY: (id: number) => `/api/Category/${id}`,
    DELETE_CATEGORY: (id: number) => `/api/Category/${id}`,

    // Cheque endpoints - .NET controller: Cheque
    GET_CHEQUES: '/api/Cheque',
    GET_CHEQUE_BY_ID: (id: number) => `/api/Cheque/${id}`,
    CREATE_CHEQUE: '/api/Cheque',
    UPDATE_CHEQUE: (id: number) => `/api/Cheque/${id}`,
    DELETE_CHEQUE: (id: number) => `/api/Cheque/${id}`,

    // Auth endpoints - .NET controller: Auth
    LOGIN: '/api/Auth/login',
    LOGOUT: '/api/Auth/logout',
    REFRESH_TOKEN: '/api/Auth/refresh',
} as const;