export interface Product  {
    productId: string,
    productName: string,
    brandId: string,
    categoryId: string,
    subCategoryId: string,
    hasVariant: boolean,
    costPrice: number ,             
    sellingPrice: number,
    discountPercentage: number,
    stockLevel: number,
    reorderLevel: number,
    image: string,
    productDescription: string,
    barcode: string,
    isActive: boolean,
    isFeatured: boolean,
    createdAt: string,
    modifiedAt: string
}

export interface ProductVariant {
    productVariantId: string;
    productId: number;  
    variantName: string; 
    size: string;
    color: string;                   
    stockLevel: number; 
    costPrice: number;
    sellingPrice: number;
    reorderLevel: number;
} 

export interface CreateProduct{
    productName: string,
    brandId: number,
    categoryId: string,
    subCategoryId: string,
    costPrice: number ,             
    sellingPrice: number,
    discountPrice: number,
    currentStock: number,
    image: string,
    description: string,
    barcode: string,
    isActive: boolean,
    isFeatured: boolean,
}

export interface ProductListResponse  {
    products: Product[],
    total: number,
    page: number,
    pageSize: number,
}

export interface ProductDashboardListResponse  {
    data: ProductDashboardResult[],
    nextCursor: string | null,
}

export interface ProductDashboardResult{
    productId: string,
    productName: string,
    brandId: string,
    categoryId: string,
    productDescription: string,
    isActive: boolean,
    sellingPrice: number,
    image: string,
    stockLevel: number,
    hasVariant: boolean,

}

export interface Cart  {
    productId: string,
    productName: string,
    sellingPrice: number,
    image: string,
    quantity: number,
}
