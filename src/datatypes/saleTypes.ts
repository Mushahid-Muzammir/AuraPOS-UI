export type Sale = {
  id: number;
  product: string;
  contact: string;
  date: string;
  time: string;
  quantity: number;
  total: number;  
  payment_method: string;
}

export type SaleRecord = {
    title: string,
    value: number,
    percentage:  number
}

export type Discount = {
    type: string;
    description: string;
    value: number;
}

export type PaymentMethods = "cash" | "card" | "koko";

