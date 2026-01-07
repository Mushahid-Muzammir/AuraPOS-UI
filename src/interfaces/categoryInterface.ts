export  interface Category {
  categoryId: string
  categoryName: string // "Men's Footwear"
  description: string,
  productCount: number
  
}

export interface SubCategory {
  id: number 
  categoryId: number 
  name: string // "Running Shoes", "Casual Sneakers"
  description: string
  image: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Brand {
  id: number 
  name: string // "Nike", "Adidas"
  logo: string // Brand logo URL
  description: string
  countryOfOrigin: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}