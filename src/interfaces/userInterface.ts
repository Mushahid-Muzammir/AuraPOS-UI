export interface User{
    userId: string
    username: string;
    passwordHash: string
    role: "admin" | "cashier" 
    fullName: string
    phone: string
    lastLogin: string
    status: "active"| "inActive"
}

