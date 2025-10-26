// Validation utilities for payment system
export const validateAmount = (amount: string | number): { isValid: boolean; error?: string } => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Invalid amount format' };
  }
  
  if (num <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (num > 1000000) {
    return { isValid: false, error: 'Amount exceeds maximum limit' };
  }
  
  return { isValid: true };
};

export const validatePhoneNumber = (phone: string): { isValid: boolean; error?: string } => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length !== 10) {
    return { isValid: false, error: 'Phone number must be 10 digits' };
  }
  
  if (!cleaned.startsWith('07')) {
    return { isValid: false, error: 'Phone number must start with 07' };
  }
  
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>\"']/g, '').trim();
};

export const formatCurrency = (amount: number): string => {
  return `LKR ${amount.toFixed(2)}`;
};

export const calculateChange = (received: number, total: number): number => {
  return Math.max(0, received - total);
};

export const validateSplitPayment = (
  amount: number, 
  remainingAmount: number, 
  totalAmount: number
): { isValid: boolean; error?: string } => {
  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (amount > remainingAmount) {
    return { isValid: false, error: `Amount cannot exceed remaining balance of ${formatCurrency(remainingAmount)}` };
  }
  
  if (amount > totalAmount) {
    return { isValid: false, error: `Amount cannot exceed total amount of ${formatCurrency(totalAmount)}` };
  }
  
  return { isValid: true };
};
