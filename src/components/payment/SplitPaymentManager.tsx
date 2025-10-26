import React, { useState } from 'react';
import { formatCurrency, validateSplitPayment } from '../../utils/validation';
import { notificationService } from '../../utils/notificationService';
import type { SplitPayment, PaymentMethods } from '../../datatypes/saleTypes';

interface SplitPaymentManagerProps {
  splitPayments: SplitPayment[];
  onAddPayment: (payment: Omit<SplitPayment, 'id' | 'status'>) => void;
  onRemovePayment: (id: number) => void;
  onCompletePayment: (id: number) => void;
  remainingAmount: number;
  totalAmount: number;
  selectedPayment: PaymentMethods;
  onPaymentSelect?: (method: PaymentMethods) => void;
}

const SplitPaymentManager: React.FC<SplitPaymentManagerProps> = ({
  splitPayments,
  onAddPayment,
  onRemovePayment,
  onCompletePayment,
  remainingAmount,
  totalAmount,
  selectedPayment
}) => {
  const [currentAmount, setCurrentAmount] = useState('');
  const [errors, setErrors] = useState<{ amount?: string }>({});

  const handleAmountChange = (value: string) => {
    setCurrentAmount(value);
    setErrors({});
  };

  const handleAddPayment = () => {
    const amountReceived = parseFloat(currentAmount);
    const validation = validateSplitPayment(amountReceived, remainingAmount, totalAmount);
    
    if (!validation.isValid) {
      setErrors({ amount: validation.error });
      notificationService.error('Invalid Amount', validation.error || 'Please enter a valid amount');
      return;
    }

    onAddPayment({
      method: selectedPayment,
      amount: amountReceived
    });

    setCurrentAmount('');
    setErrors({});
    notificationService.success('Payment Added', 'Split payment added successfully');
  };

  const getPaymentIcon = (method: PaymentMethods) => {
    switch (method) {
      case 'cash': return '💵';
      case 'card': return '💳';
      case 'koko': return '📱';
      default: return '💰';
    }
  };

  const getStatusColor = (status: SplitPayment['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200';
      case 'pending': return 'bg-yellow-50 border-yellow-200';
      case 'failed': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const totalPaid = splitPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4">
      {/* Split Payment Input - Always show when split is enabled */}
      <div className="p-6 bg-blue-50 border-t border-b border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Amount for This Payment
            </label>
            <input
              type="number"
              value={currentAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              max={remainingAmount}
              className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-semibold ${
                errors.amount ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              } focus:outline-none`}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Remaining: {formatCurrency(remainingAmount)}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleAddPayment}
              disabled={!currentAmount || parseFloat(currentAmount) <= 0}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                currentAmount && parseFloat(currentAmount) > 0
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Add Payment
            </button>
          </div>
        </div>
      </div>

      {/* Split Payments List */}
      {splitPayments.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Split Payments</h4>
          {splitPayments.map((payment, index) => (
            <div
              key={payment.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                getStatusColor(payment.status)
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{getPaymentIcon(payment.method)}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 capitalize">
                    {payment.method} Payment
                  </p>
                  <p className="text-xs text-gray-500">Payment #{index + 1}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-800">
                  {formatCurrency(payment.amount)}
                </span>
                {payment.status === 'completed' ? (
                  <span className="text-green-600 text-lg">✅</span>
                ) : payment.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onCompletePayment(payment.id)}
                      className="text-green-600 hover:text-green-800 text-sm font-semibold"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => onRemovePayment(payment.id)}
                      className="text-red-400 hover:text-red-600 text-lg"
                    >
                      🗑️
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onRemovePayment(payment.id)}
                    className="text-red-400 hover:text-red-600 text-lg"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold">
                {formatCurrency(totalPaid)} / {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (totalPaid / totalAmount) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitPaymentManager;
