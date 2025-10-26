// Payment system configuration
export const PAYMENT_CONFIG = {
  // Service charges and taxes
  SERVICE_CHARGE_RATE: 0.025, // 2.5%
  TAX_RATE: 0.15, // 15%
  
  // Transaction limits
  MAX_TRANSACTION_AMOUNT: 1000000,
  MIN_TRANSACTION_AMOUNT: 0.01,
  
  // Quick cash amounts
  QUICK_CASH_AMOUNTS: [5000, 10000, 20000],
  
  // Supported payment methods
  SUPPORTED_PAYMENT_METHODS: ['cash', 'card', 'koko'] as const,
  
  // Receipt settings
  RECEIPT_SETTINGS: {
    includeCustomerInfo: true,
    includeItemDetails: true,
    showTaxBreakdown: true,
    companyName: 'AURA POS SYSTEM',
    companyAddress: '123 Business Street, Colombo, Sri Lanka',
    companyPhone: '+94 11 234 5678'
  },
  
  // Notification settings
  NOTIFICATION_DURATION: 5000, // 5 seconds
  AUTO_CLOSE_NOTIFICATIONS: true,
  
  // Validation settings
  PHONE_NUMBER_LENGTH: 10,
  PHONE_NUMBER_PREFIX: '07',
  
  // UI settings
  ANIMATION_DURATION: 300,
  LOADING_TIMEOUT: 10000, // 10 seconds
} as const;

export type PaymentConfig = typeof PAYMENT_CONFIG;
