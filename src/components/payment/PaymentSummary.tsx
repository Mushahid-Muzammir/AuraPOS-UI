import React from 'react';
import { formatCurrency } from '../../utils/validation';
import ApplyDiscount from '../checkout/ApplyDiscount';

interface PaymentSummaryProps {
  cart: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  calculations: {
    subtotal: number;
    tax: number;
  };
  discountPercentage: number;
  discountAmount: number;
  serviceCharge: number;
  total: number;
  customer?: {
    name: string;
    phone: string;
    loyaltyPoints: number;
  };
  onSetDiscount: (discount: number) => void;
  onRemoveItem: (id: number) => void;
  onCancelSale: () => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  cart,
  calculations,
  discountPercentage,
  discountAmount,
  serviceCharge,
  total,
  customer,
  onSetDiscount,
  onRemoveItem,
  onCancelSale
}) => {
  return (
    <div className="w-[25%] h-[100%] bg-white flex flex-col gap-4 justify-between items-center border px-2 py-4">
      {/* Customer Information */}
      {customer && (
        <div className="w-full flex flex-col gap-1 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800">Customer Information</h3>
          <p className="text-base text-gray-700">Name: {customer.name}</p>
          <p className="text-base text-gray-700">Phone: {customer.phone}</p>
          <p className="text-base text-gray-700">Loyalty Points: {customer.loyaltyPoints}</p>
        </div>
      )}

      {/* Discount Section */}
      <div className="w-full px-4 shadow-lg border border-grey-400 rounded-lg">
        <ApplyDiscount onSetDiscount={onSetDiscount} />
      </div>

      {/* Order Items */}
      <div className="w-full flex-1 overflow-y-auto">
        <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
        <div className="space-y-2">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(item.price)} × {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">
                  {formatCurrency(item.price * item.quantity)}
                </span>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="w-full flex flex-col gap-4 p-6 border-t border-gray-200">
        <div className="flex flex-row justify-between w-full">
          <div className="text-gray-600">Subtotal</div>
          <div className="text-gray-600">{formatCurrency(calculations.subtotal)}</div>
        </div>
        
        {discountPercentage > 0 && (
          <div className="flex flex-row justify-between w-full">
            <div className="text-green-400">Discount ({discountPercentage}%)</div>
            <div className="text-green-400">- {formatCurrency(discountAmount)}</div>
          </div>
        )}
        
        <div className="flex flex-row justify-between w-full">
          <div className="text-red-400">Tax</div>
          <div className="text-red-400">+ {formatCurrency(calculations.tax)}</div>
        </div>
        
        <div className="flex flex-row justify-between w-full pb-4 border-b">
          <div className="text-gray-600">Service Charge</div>
          <div className="text-gray-600">{formatCurrency(serviceCharge)}</div>
        </div>
        
        <div className="flex flex-row justify-between w-full">
          <div className="font-bold text-2xl">Total</div>
          <div className="text-2xl font-bold">{formatCurrency(total)}</div>
        </div>
      </div>

      {/* Cancel Sale Button */}
      <div className="w-full p-6 border-t border-gray-200">
        <button
          onClick={onCancelSale}
          className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
        >
          CANCEL SALE
        </button>
      </div>
    </div>
  );
};

export default PaymentSummary;
