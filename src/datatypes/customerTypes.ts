export type Customer = {
  id: string;
  name: string;
  phone: string;
  birthday: string;
  totalVisit: string;  
  lastVisit: string;
  loyaltyPoints: number;
}

export type NewCustomer = {
  name: string;
  phone: string;
  birthday: string;
  loyaltyPoints?: number;
}

export type ExistingCustomer = {
  name: string;
  phone: string;
  loyaltyPoints: number;
}