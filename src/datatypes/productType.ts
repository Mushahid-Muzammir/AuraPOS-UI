export type Product = {
    id: string,
    name: string,
    category: string,
    price: number,
    stock: number,
    image: string,
    description: string,
}

export type CreateProduct = Omit<Product, 'id'>;

export type ProductListResponse = {
    products: Product[],
    total: number,
    page: number,
    pageSize: number,
}

export type Cart = {
    id: string,
    name: string,
    category: string,
    price: number,
    stock: number,
    image: string,
    description: string,
    quantity: number,

}

export type Category = {
    id: number,
    name: string,
}