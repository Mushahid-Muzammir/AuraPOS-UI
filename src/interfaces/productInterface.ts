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
    currentStock: number,
    reorderLevel: number,
    image: string,
    description: string,
    barcode: string,
    isActive: boolean,
    isFeatured: boolean,
    createdAt: string,
    modifiedAt: string
}

export interface ProductVariant {
    productVariantId: string;
    productId: number;  
    size: string;
    color: string;                   
    currentStock: number; // Stock for this size/color
    length: number; // Shoe length in cm
    width: string; // Narrow, Regular, Wide
    costPrice: number;
    sellingPrice: number;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
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

export interface Cart  {
    id: string,
    name: string,
    category: string,
    price: number,
    stock: number,
    image: string,
    description: string,
    quantity: number,
}

export interface Category  {
    id: number,
    name: string,
}