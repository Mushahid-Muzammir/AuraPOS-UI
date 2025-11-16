export interface Cheque  {
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

export interface NewChequeData {
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