// Transaction logging utilities
export interface TransactionLog {
  id: string;
  timestamp: Date;
  type: 'payment' | 'refund' | 'void';
  method: 'cash' | 'card' | 'koko';
  amount: number;
  customerId?: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  discount?: {
    percentage: number;
    amount: number;
  };
  serviceCharge: number;
  tax: number;
  total: number;
  change?: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  receiptNumber?: string;
}

export class TransactionLogger {
  private static instance: TransactionLogger;
  private transactions: TransactionLog[] = [];

  static getInstance(): TransactionLogger {
    if (!TransactionLogger.instance) {
      TransactionLogger.instance = new TransactionLogger();
    }
    return TransactionLogger.instance;
  }

  logTransaction(transaction: Omit<TransactionLog, 'id' | 'timestamp' | 'receiptNumber'>): TransactionLog {
    const receiptNumber = this.generateReceiptNumber();
    const fullTransaction: TransactionLog = {
      ...transaction,
      id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      receiptNumber
    };

    this.transactions.push(fullTransaction);
    this.saveToStorage();
    
    return fullTransaction;
  }

  getTransaction(id: string): TransactionLog | undefined {
    return this.transactions.find(t => t.id === id);
  }

  getAllTransactions(): TransactionLog[] {
    return [...this.transactions];
  }

  getTransactionsByDateRange(startDate: Date, endDate: Date): TransactionLog[] {
    return this.transactions.filter(t => 
      t.timestamp >= startDate && t.timestamp <= endDate
    );
  }

  private generateReceiptNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const sequence = this.transactions.length + 1;
    
    return `RCP${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('pos_transactions', JSON.stringify(this.transactions));
    } catch (error) {
      console.error('Failed to save transactions to localStorage:', error);
    }
  }

  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('pos_transactions');
      if (stored) {
        this.transactions = JSON.parse(stored).map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load transactions from localStorage:', error);
    }
  }
}

export const transactionLogger = TransactionLogger.getInstance();
