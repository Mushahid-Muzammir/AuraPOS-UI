import React, { useState } from 'react';
import { formatCurrency } from '../../utils/validation';
import { notificationService } from '../../utils/notificationService';

interface CardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  totalAmount: number;
  isSplitPayment?: boolean;
  splitAmount?: number;
}

const CardPaymentModal: React.FC<CardPaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
  isSplitPayment = false,
  splitAmount = 0
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<'waiting' | 'processing' | 'completed'>('waiting');

  const targetAmount = isSplitPayment ? splitAmount : totalAmount;

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setProcessingStep('processing');
    
    // Simulate card processing
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessingStep('completed');
      onConfirm(targetAmount);
      
      // Simulate success delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      notificationService.success('Payment Successful', 'Card payment processed successfully');
    } catch (error) {
      notificationService.error('Payment Failed', 'Card payment could not be processed');
      setIsProcessing(false);
      setProcessingStep('waiting');
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-lg w-full rounded-lg shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              💳
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Card Payment</h3>
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

        <div className="p-6">
          {processingStep === 'waiting' && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="animate-pulse w-6 h-6 bg-yellow-400 rounded-full"></div>
                <p className="font-bold text-yellow-800">Ready for Card</p>
              </div>
              <p className="text-sm text-yellow-700">
                Please insert, tap, or swipe the card on the payment terminal.
              </p>
            </div>
          )}

          {processingStep === 'processing' && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="font-bold text-blue-800">Processing Payment</p>
              </div>
              <p className="text-sm text-blue-700">
                Please wait while we process your card payment...
              </p>
            </div>
          )}

          {processingStep === 'completed' && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-xl font-bold text-green-800 mb-2">
                Payment Approved!
              </p>
              <p className="text-sm text-green-700">
                Your card payment has been processed successfully.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                !isProcessing
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isProcessing ? 'Processing...' : 'Process Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentModal;
