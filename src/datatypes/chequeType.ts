export type Cheque = {
    id: number;
    chequeNumber: string;
    customerName: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    type: 'receive' | 'give';
    status: 'pending' | 'cleared' | 'bounced' | 'cancelled';
    bankName: string;
    description: string;
}

export type NewChequeData = Omit<Cheque, 'id'>;