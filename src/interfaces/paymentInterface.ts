import type { PaymentMethods } from "./saleInterface";

export interface Payment{
    paymentId: string;
    saleId: string;
    paymentMethod: PaymentMethods;
    amount: number;
    transactionId: string;
    paymentSuccess: "sucess"| "failed";
    createdAt: string;
}