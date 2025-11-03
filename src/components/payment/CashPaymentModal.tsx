import React, { useState, useEffect } from 'react';
import { validateAmount, formatCurrency, calculateChange } from '../../utils/validation';
import { notificationService } from '../../utils/notificationService';

interface CashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  totalAmount: number;
  isSplitPayment?: boolean;
  splitAmount?: number;
}

const CashPaymentModal: React.FC<CashPaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
  isSplitPayment = false,
  splitAmount = 0
}) => {
  const [cashReceived, setCashReceived] = useState('');
  const [errors, setErrors] = useState<{ amount?: string }>({});

  const targetAmount = isSplitPayment ? splitAmount : totalAmount;

  useEffect(() => {
    if (isOpen) {
      setCashReceived('');
      setErrors({});
    }
  }, [isOpen]);

  const handleAmountChange = (value: string) => {
    setCashReceived(value);
    setErrors({});
  };

  const handleQuickAmount = (amount: number) => {
    setCashReceived(amount.toString());
    setErrors({});
  };

  const handleConfirm = () => {
    if(isSplitPayment){
      const amount = parseFloat(targetAmount.toString());
      onConfirm(amount);
      return;
    }
    const validation = validateAmount(cashReceived);
    if (!validation.isValid) {
      setErrors({ amount: validation.error });
      notificationService.error('Invalid Amount', validation.error || 'Please enter a valid amount');
      return;
    }

    const amount = parseFloat(cashReceived);
    if (amount < targetAmount) {
      const error = `Amount must be at least ${formatCurrency(targetAmount)}`;
      setErrors({ amount: error });
      notificationService.error('Insufficient Amount', error);
      return;
    }

    onConfirm(amount);
  };

  const change = calculateChange(parseFloat(cashReceived || '0'), targetAmount);
  const hasEnoughCash = parseFloat(cashReceived || '0') >= targetAmount;

  const quickAmounts = [
    { label: "5,000", value: 5000 },
    { label: "10,000", value: 10000 },
    { label: "20,000", value: 20000 },
    { label: "Exact", value: targetAmount }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-xl w-full rounded-lg shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              💵
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Cash Payment</h3>
              {isSplitPayment && <p className="text-sm text-gray-500">Split Payment</p>}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">
              {isSplitPayment ? "Payment Amount" : "Total Amount"}
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(targetAmount)}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cash Received
            </label>
            <input
              type="number"
              value={isSplitPayment ? targetAmount : cashReceived}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-semibold ${
                errors.amount ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              } focus:outline-none`}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount.label}
                onClick={() => handleQuickAmount(amount.value)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors"
              >
                {amount.label}
              </button>
            ))}
          </div>

          {hasEnoughCash && change > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 font-semibold mb-1">
                Change to Return
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(change)}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={!isSplitPayment ? !hasEnoughCash : false}
              className={`flex-1 py-3 font-semibold transition-colors ${
                !isSplitPayment && !hasEnoughCash
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              Open Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashPaymentModal;
