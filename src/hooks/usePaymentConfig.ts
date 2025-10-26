import { useState, useEffect } from 'react';

export interface PaymentConfig {
  serviceChargeRate: number;
  taxRate: number;
  maxTransactionAmount: number;
  quickCashAmounts: number[];
  supportedPaymentMethods: string[];
  receiptSettings: {
    includeCustomerInfo: boolean;
    includeItemDetails: boolean;
    showTaxBreakdown: boolean;
  };
}

const defaultConfig: PaymentConfig = {
  serviceChargeRate: 0.025, // 2.5%
  taxRate: 0.15, // 15%
  maxTransactionAmount: 1000000,
  quickCashAmounts: [5000, 10000, 20000],
  supportedPaymentMethods: ['cash', 'card', 'koko'],
  receiptSettings: {
    includeCustomerInfo: true,
    includeItemDetails: true,
    showTaxBreakdown: true
  }
};

export const usePaymentConfig = () => {
  const [config, setConfig] = useState<PaymentConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load configuration from localStorage or API
    const loadConfig = async () => {
      try {
        const stored = localStorage.getItem('payment_config');
        if (stored) {
          const parsedConfig = JSON.parse(stored);
          setConfig({ ...defaultConfig, ...parsedConfig });
        }
      } catch (error) {
        console.error('Failed to load payment config:', error);
        setConfig(defaultConfig);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const updateConfig = (newConfig: Partial<PaymentConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    
    try {
      localStorage.setItem('payment_config', JSON.stringify(updatedConfig));
    } catch (error) {
      console.error('Failed to save payment config:', error);
    }
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem('payment_config');
  };

  return {
    config,
    updateConfig,
    resetConfig,
    isLoading
  };
};
