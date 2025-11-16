import React from 'react';
import type { PaymentMethods } from '../../interfaces/saleInterface';
import cash from '../../assets/cash.svg';
import card from '../../assets/card.svg';
import koko from '../../assets/koko.svg';

interface PaymentMethodSelectorProps {
  selectedPayment: PaymentMethods;
  onPaymentSelect: (method: PaymentMethods) => void;
  disabled?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedPayment,
  onPaymentSelect,
  disabled = false
}) => {
  const paymentMethods = [
    {
      id: 'cash' as PaymentMethods,
      label: 'CASH',
      icon: cash,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      id: 'card' as PaymentMethods,
      label: 'CARD',
      icon: card,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 'koko' as PaymentMethods,
      label: 'KOKO',
      icon: koko,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
        Select Payment Method
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onPaymentSelect(method.id)}
            disabled={disabled}
            className={`p-6 bg-white rounded-xl border-2 transition-all hover:shadow-md ${
              selectedPayment === method.id
                ? "border-blue-500 shadow-lg shadow-blue-100"
                : "border-gray-200 hover:border-gray-300"
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedPayment === method.id
                    ? method.bgColor
                    : "bg-gray-100"
                }`}
              >
                <img src={method.icon} className="object-contain" alt={method.label} />
              </div>
              <span
                className={`font-bold text-lg ${
                  selectedPayment === method.id
                    ? method.textColor
                    : "text-gray-700"
                }`}
              >
                {method.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
