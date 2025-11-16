import type {Cart} from "./productInterface";
import type { NewCustomer, ExistingCustomer } from "./customerInterface";


export interface Sale {
  saleId: string;
  customerId: string;
  saleDate: string;
  saleTime: string;
  subTotal: number;  
  discountPercentage: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  payment_method: string;
  paymentStatus: string;             
  paidAmount: number;
  changeGiven: number;
  productName: string;
  contact: string
}

export interface SaleItem {
  saleItemId: string;
  saleId: string;
  productVariationId: string;
  quantity: number;  
  discountPercentage: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface LoyaltyTransaction{
  loyaltyTransactionId: string;
  saleId: string;
  customerId: string;
  points: string;
  transactionType: "redeem"| "earned";
  createdAt: string;
}

export interface SaleRecord {
    title: string,
    value: number,
    percentage:  number
}

export interface Discount {
    interface: string;
    description: string;
    value: number;
}

export type PaymentMethods = "cash" | "card" | "koko";

export interface SplitPayment {
    id: number;
    method: PaymentMethods;
    amount: number;
    status: "pending" | "completed" | "failed";
}

export interface TotalProps {
  subtotal: number;
  tax: number;
}

export interface OrderProps {
    cart : Cart[];
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
}

export interface PaymentProps {
  cart: Cart[];
  customer:  NewCustomer | ExistingCustomer | null;
  calculations: TotalProps;
  timestamp: number;  
};  

export interface ApplyDisCountProps {
    onSetDiscount: (type: number) => void;
}