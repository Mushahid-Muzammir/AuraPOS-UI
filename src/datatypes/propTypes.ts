import type { Cart } from "./productType";
import type { NewCustomer, ExistingCustomer } from "./customerTypes";

export type TotalProps = {
  subtotal: number;
  tax: number;
}

export type OrderProps = {
    cart : Cart[];
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
}

export type AddCustomerInfoProps = {
  showCustomerForm: boolean;
  onChangeDisplayForm: (value: boolean) => void;
  onSetCustomer: (customer: NewCustomer | ExistingCustomer) => void;
};

export type PaymentProps = {
  cart: Cart[];
  customer:  NewCustomer | ExistingCustomer | null;
  calculations: TotalProps;
  timestamp: number;  
};  

export type ApplyDisCountProps = {
    onSetDiscount: (type: number) => void;
}