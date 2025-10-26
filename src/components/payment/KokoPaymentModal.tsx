import React, { useState, useEffect } from 'react';
import { validatePhoneNumber } from '../../utils/validation';
import { formatCurrency } from '../../utils/validation';
import { notificationService } from '../../utils/notificationService';

interface KokoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (phone: string) => void;
  totalAmount: number;
  isSplitPayment?: boolean;
  splitAmount?: number;
}

const KokoPaymentModal: React.FC<KokoPaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
  isSplitPayment = false,
  splitAmount = 0
}) => {
  const [kokoPhone, setKokoPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'waiting' | 'success' | 'failed'>('idle');
  const [errors, setErrors] = useState<{ phone?: string }>({});

  const targetAmount = isSplitPayment ? splitAmount : totalAmount;

  useEffect(() => {
    if (isOpen) {
      setKokoPhone('');
      setIsProcessing(false);
      setStatus('idle');
      setErrors({});
    }
  }, [isOpen]);

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    setKokoPhone(cleaned);
    setErrors({});
  };

  const handleSendRequest = async () => {
    const validation = validatePhoneNumber(kokoPhone);
    if (!validation.isValid) {
      setErrors({ phone: validation.error });
      notificationService.error('Invalid Phone Number', validation.error || 'Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);
    setStatus('waiting');

    try {
      // Simulate sending request to Koko
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate customer approval
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStatus('success');
      notificationService.success('Payment Approved', 'Customer has approved the payment on their device');
      
      // Auto-confirm after success
      setTimeout(() => {
        onConfirm(kokoPhone);
      }, 1500);
      
    } catch (error) {
      setStatus('failed');
      notificationService.error('Payment Failed', 'Koko payment could not be processed');
      setIsProcessing(false);
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
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              📱
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Koko Payment</h3>
              {isSplitPayment && <p className="text-sm text-gray-500">Split Payment</p>}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(targetAmount)}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {status === 'idle' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Customer Mobile Number
                </label>
                <input
                  type="tel"
                  value={kokoPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="07X XXX XXXX"
                  className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Enter customer's registered Koko mobile number
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <strong>Note:</strong> Customer will receive a push notification on their Koko app to approve this payment.
                </p>
              </div>
            </>
          )}

          {status === 'waiting' && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="animate-pulse w-6 h-6 bg-yellow-400 rounded-full"></div>
                <p className="font-bold text-yellow-800">Waiting for Customer Approval</p>
              </div>
              <p className="text-sm text-yellow-700 mb-4">
                A payment request has been sent to the customer's Koko app. Please ask them to approve the transaction.
              </p>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Request sent to</p>
                <p className="text-lg font-bold text-gray-800">{kokoPhone}</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-xl font-bold text-green-800 mb-2">Payment Approved!</p>
              <p className="text-sm text-green-700">
                The customer has successfully approved the payment.
              </p>
            </div>
          )}

          {status === 'failed' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <p className="text-xl font-bold text-red-800 mb-2">Payment Failed</p>
              <p className="text-sm text-red-700">
                The payment could not be processed. Please try again.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSendRequest}
              disabled={
                kokoPhone.length !== 10 ||
                isProcessing ||
                status !== 'idle'
              }
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                kokoPhone.length === 10 && !isProcessing && status === 'idle'
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isProcessing ? 'Processing...' : 'Send Payment Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KokoPaymentModal;
