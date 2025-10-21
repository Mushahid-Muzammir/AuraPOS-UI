export type Customer = {
  id: string;
  name: string;
  phone: string;
  birthday: string;
  totalVisit: string;  // Changed to string to match JSON
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