export interface AddCustomerInfoProps  {
  showCustomerForm: boolean;
  onChangeDisplayForm: (value: boolean) => void;
  onSetCustomer: (customer: NewCustomer | ExistingCustomer) => void;
};

export interface Customer {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  birthDate: string;
  loyaltyPoints: number;
  totalPurchases : number;
}

export interface NewCustomer  {
  name: string;
  phone: string;
  birthday: string;
  loyaltyPoints?: number;
}

export interface ExistingCustomer  {
  name: string;
  phone: string;
  loyaltyPoints: number;
}

export interface CustomerListResponse  {
    products: Customer[],
    total: number,
    page: number,
    pageSize: number,
}
