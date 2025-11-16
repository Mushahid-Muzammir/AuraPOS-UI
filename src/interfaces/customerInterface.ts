export interface AddCustomerInfoProps  {
  showCustomerForm: boolean;
  onChangeDisplayForm: (value: boolean) => void;
  onSetCustomer: (customer: NewCustomer | ExistingCustomer) => void;
};

export interface Customer {
  id: string;
  name: string;
  phone: string;
  birthday: string;
  totalVisit: string;  
  lastVisit: string;
  loyaltyPoints: number;
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
