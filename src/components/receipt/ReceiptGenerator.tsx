import React from 'react';
import type { TransactionLog } from '../../utils/transactionLogger';
import { formatCurrency } from '../../utils/validation';

interface ReceiptGeneratorProps {
  transaction: TransactionLog;
  onClose: () => void;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ transaction, onClose }) => {
  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${transaction.receiptNumber}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.4;
              margin: 0;
              padding: 20px;
              max-width: 300px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .total {
              border-top: 1px solid #000;
              padding-top: 10px;
              margin-top: 10px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>AURA POS SYSTEM</h2>
            <p>Receipt: ${transaction.receiptNumber}</p>
            <p>Date: ${transaction.timestamp.toLocaleString()}</p>
          </div>
          
          <div class="items">
            ${transaction.items.map(item => `
              <div class="item">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="totals">
            <div class="item">
              <span>Subtotal:</span>
              <span>${formatCurrency(transaction.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
            </div>
            ${transaction.discount ? `
              <div class="item">
                <span>Discount (${transaction.discount.percentage}%):</span>
                <span>-${formatCurrency(transaction.discount.amount)}</span>
              </div>
            ` : ''}
            <div class="item">
              <span>Service Charge:</span>
              <span>${formatCurrency(transaction.serviceCharge)}</span>
            </div>
            <div class="item">
              <span>Tax:</span>
              <span>${formatCurrency(transaction.tax)}</span>
            </div>
            <div class="item total">
              <span>TOTAL:</span>
              <span>${formatCurrency(transaction.total)}</span>
            </div>
            ${transaction.change ? `
              <div class="item">
                <span>Cash Received:</span>
                <span>${formatCurrency(transaction.amount)}</span>
              </div>
              <div class="item">
                <span>Change:</span>
                <span>${formatCurrency(transaction.change)}</span>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>Payment Method: ${transaction.method.toUpperCase()}</p>
            <p>Thank you for your business!</p>
            <p>Generated at: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-md w-full rounded-lg shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Receipt Preview</h3>
          <p className="text-sm text-gray-600">Receipt: {transaction.receiptNumber}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Transaction Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{transaction.timestamp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="capitalize">{transaction.method}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold">{formatCurrency(transaction.total)}</span>
              </div>
              {transaction.change && (
                <div className="flex justify-between">
                  <span>Change:</span>
                  <span className="font-bold">{formatCurrency(transaction.change)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={printReceipt}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
