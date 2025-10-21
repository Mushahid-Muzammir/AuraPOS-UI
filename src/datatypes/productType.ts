export type Product = {
    id: number,
    name: string,
    category: string,
    price: number,
    stock: number,
    image: string,
    description: string,
}

export type Cart = {
    id: number,
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