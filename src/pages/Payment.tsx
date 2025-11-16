import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "../components/common/TopBar";
import SideBar from "../components/common/SideBar";
import NotificationContainer from "../components/notifications/NotificationContainer";
import PaymentMethodSelector from "../components/payment/PaymentMethodSelector";
import CashPaymentModal from "../components/payment/CashPaymentModal";
import CardPaymentModal from "../components/payment/CardPaymentModal";
import KokoPaymentModal from "../components/payment/KokoPaymentModal";
import SplitPaymentManager from "../components/payment/SplitPaymentManager";
import PaymentSummary from "../components/payment/PaymentSummary";
import { usePaymentConfig } from "../hooks/usePaymentConfig";
import { transactionLogger } from "../utils/transactionLogger";
import { notificationService } from "../utils/notificationService";
import { formatCurrency, validateAmount } from "../utils/validation";
import type { PaymentProps } from "../interfaces/saleInterface.ts";
import type { Discount, PaymentMethods, SplitPayment } from "../interfaces/saleInterface.ts";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData = location.state as PaymentProps;
  const { cart, customer, calculations } = paymentData;
  const { config } = usePaymentConfig();
  
  // Payment state
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethods>('cash');
  const [showCashModal, setShowCashModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showKokoModal, setShowKokoModal] = useState(false);
  
  // Split payment state
  const [splitPaymentEnabled, setSplitPaymentEnabled] = useState(false);
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([]);
  const [currentSplitAmount, setCurrentSplitAmount] = useState("");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const [showFinalSummary, setShowFinalSummary] = useState(false);

  // Cart and calculations
  const [finalCart, setFinalCart] = useState(cart || []);
  const [discountPercentage, setDiscountPercentage] = useState<Discount["value"]>(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const removeItem = (id: string) => {
    const updatedCart = finalCart.filter((item) => item.id !== id);
    setFinalCart(updatedCart);
    notificationService.info('Item Removed', 'Item has been removed from the cart');
  };

  // Calculations using config
  const subtotal = finalCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceCharge = subtotal * config.serviceChargeRate;
  const tax = subtotal * config.taxRate;
  const total = subtotal + serviceCharge + tax - discountAmount;

  const totalPaid = splitPayments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = total - totalPaid;

  useEffect(() => {
    if (!paymentData || !paymentData.cart || paymentData.cart.length === 0) {
      navigate("/home");
      return;
    }

    if (discountPercentage > 0) {
      setDiscountAmount(total * discountPercentage * 0.01);
    } else {
      setDiscountAmount(0);
    }
  }, [paymentData, navigate, discountPercentage, total]);

  const handlePaymentSelect = (method: PaymentMethods) => {
    setSelectedPayment(method);
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) {
      notificationService.error('No Payment Method', 'Please select a payment method');
      return;
    }

    if (splitPaymentEnabled && !currentSplitAmount) {
      notificationService.error('Missing Amount', 'Please enter the amount for this payment');
      return;
    }

    if (splitPaymentEnabled) {
      const amount = parseFloat(currentSplitAmount);
      const validation = validateAmount(amount);
      if (!validation.isValid) {
        notificationService.error('Invalid Amount', validation.error || 'Please enter a valid amount');
        return;
      }
      if (amount > remainingAmount) {
        notificationService.error('Amount Too High', `Amount cannot exceed remaining balance of ${formatCurrency(remainingAmount)}`);
        return;
      }
    }

    switch (selectedPayment) {
      case 'cash':
        setShowCashModal(true);
        break;
      case 'card':
        setShowCardModal(true);
        break;
      case 'koko':
        setShowKokoModal(true);
        break;
    }
  };

  const handleCashPayment = (amount: number) => {
    const change = amount - (splitPaymentEnabled ? parseFloat(currentSplitAmount) : total);
    
    if (splitPaymentEnabled) {
      // For split payments, just add to the list and show receipt
      const newPayment: SplitPayment = {
        id: Date.now(),
        method: 'cash',
        amount: parseFloat(amount.toString()),
        status: "completed"
      };
      setSplitPayments(prev => [...prev, newPayment]);
      
      // Log transaction and show receipt
      const transaction = logTransaction('cash', parseFloat(currentSplitAmount), change);
      setCurrentTransaction(transaction);
      setShowReceiptModal(true);
      setShowCashModal(false);
      
      notificationService.success('Payment Added', 'Cash payment added to split payment');
    } else {
      // For single payments, complete the sale
      const transaction = logTransaction('cash', amount, change);
      setCurrentTransaction(transaction);
      setShowReceiptModal(true);
      setShowCashModal(false);
      
      notificationService.success('Payment Successful', `Cash payment completed. Change: ${formatCurrency(change)}`);
    }
  };

  const handleCardPayment = (amount : number) => {
    if (splitPaymentEnabled) {
      // For split payments, add to the list and show receipt
      const newPayment: SplitPayment = {
        id: Date.now(),
        method: 'card',
        amount: parseFloat(amount.toString()),
        status: "completed"
      };
      setSplitPayments(prev => [...prev, newPayment]);
      
      // Log transaction and show receipt
      const transaction = logTransaction('card', amount);
      setCurrentTransaction(transaction);
      setShowReceiptModal(true);
      setShowCardModal(false);
      
      notificationService.success('Payment Added', 'Card payment added to split payment');
    } else {
      // For single payments, complete the sale
      const transaction = logTransaction('card', total);
      setCurrentTransaction(transaction);
      setShowReceiptModal(true);
      setShowCardModal(false);
      
      notificationService.success('Payment Successful', 'Card payment processed successfully');
    }
  };

  const handleKokoPayment = (phone: string) => {
    if (splitPaymentEnabled) {
      // For split payments, add to the list and show receipt
      const newPayment: SplitPayment = {
        id: Date.now(),
        method: 'koko',
        amount: parseFloat(currentSplitAmount),
        status: "completed"
      };
      setSplitPayments(prev => [...prev, newPayment]);
      
      // Log transaction and show receipt
      const transaction = logTransaction('koko', parseFloat(currentSplitAmount));
      setCurrentTransaction(transaction);
      setShowReceiptModal(true);
      setShowKokoModal(false);
      
      notificationService.success('Payment Added', 'Koko payment added to split payment');
    } else {
      // For single payments, complete the sale
      const transaction = logTransaction('koko', total);
      setCurrentTransaction(transaction);
      setShowReceiptModal(true);
      setShowKokoModal(false);
      
      notificationService.success('Payment Successful', `Koko payment approved by customer (${phone})`);
    }
  };

  const logTransaction = (method: PaymentMethods, amount: number, change?: number) => {
    const transaction = transactionLogger.logTransaction({
      type: 'payment',
      method,
      amount,
      customerId: customer?.phone,
      items: finalCart,
      discount: discountPercentage > 0 ? { percentage: discountPercentage, amount: discountAmount } : undefined,
      serviceCharge,
      tax,
      total,
      change,
      status: 'completed'
    });

    notificationService.info('Transaction Logged', `Receipt: ${transaction.receiptNumber}`);
    return transaction;
  };

  const addSplitPayment = (payment: Omit<SplitPayment, "id" | "status">) => {
    if (!payment.method || !payment.amount) {
      notificationService.error('Missing Information', 'Please select payment method and enter amount');
      return;
    }
    const amount = payment.amount;
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      notificationService.error('Invalid Amount', validation.error || 'Please enter a valid amount');
      return;
    }

    if (amount > remainingAmount) {
      notificationService.error('Amount Too High', `Amount cannot exceed remaining balance of ${formatCurrency(remainingAmount)}`);
      return;
    }
    setCurrentSplitAmount(payment.amount.toString());
    // Show the appropriate payment modal based on selected method
    switch (payment.method) {
      case 'cash':
        setShowCashModal(true);
        break;
      case 'card':
        setShowCardModal(true);
        break;
      case 'koko':
        setShowKokoModal(true);
        break;
    }
  };

  const completeSplitPayment = (paymentId: number) => {
    setSplitPayments(payments =>
      payments.map(p => p.id === paymentId ? { ...p, status: 'completed' as const } : p)
    );
    
    notificationService.success('Payment Completed', 'Split payment completed successfully');
  };

  const handlePrintReceipt = () => {
    if (currentTransaction) {
      // Open print dialog
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const receiptHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt - ${currentTransaction.receiptNumber}</title>
            <style>
              @media print {
                @page { size: 80mm auto; margin: 0; }
                body { font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.4; margin: 0; padding: 0; }
                .receipt { width: 80mm; padding: 10px; page-break-inside: avoid; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
                .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                .total { border-top: 1px solid #000; padding-top: 10px; margin-top: 10px; font-weight: bold; }
                .footer { text-align: center; margin-top: 20px; font-size: 10px; }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
              <h2>SHOE PALACE</h2>
              <p>Receipt: ${currentTransaction.receiptNumber}</p>
              <p>Date: ${currentTransaction.timestamp.toLocaleString()}</p>
            </div>
            <div class="items">
              ${currentTransaction.items.map((item: any) => `
                <div class="item">
                  <span>${item.name} x${item.quantity}</span>
                  <span>${formatCurrency(item.price * item.quantity)}</span>
                </div>
              `).join('')}
            </div>
            <div class="totals">
              <div class="item">
                <span>Subtotal:</span>
                <span>${formatCurrency(currentTransaction.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0))}</span>
              </div>
              ${currentTransaction.discount ? `
                <div class="item">
                  <span>Discount (${currentTransaction.discount.percentage}%):</span>
                  <span>-${formatCurrency(currentTransaction.discount.amount)}</span>
                </div>
              ` : ''}
              <div class="item">
                <span>Service Charge:</span>
                <span>${formatCurrency(currentTransaction.serviceCharge)}</span>
              </div>
              <div class="item">
                <span>Tax:</span>
                <span>${formatCurrency(currentTransaction.tax)}</span>
              </div>
              <div class="item total">
                <span>TOTAL:</span>
                <span>${formatCurrency(currentTransaction.total)}</span>
              </div>
              ${currentTransaction.change ? `
                <div class="item">
                  <span>Cash Received:</span>
                  <span>${formatCurrency(currentTransaction.amount)}</span>
                </div>
                <div class="item">
                  <span>Change:</span>
                  <span>${formatCurrency(currentTransaction.change)}</span>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Payment Method: ${currentTransaction.method.toUpperCase()}</p>
              <p>Thank you for coming!</p>
              <p>Generated at: ${new Date().toLocaleString()}</p>
            </div>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(receiptHTML);
      notificationService.success('Print Initiated', 'Receipt print dialog opened');
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
      notificationService.success('Print Completed', 'Receipt printed successfully');
    }
  };

  const handleCompleteSale = () => {
    setShowReceiptModal(false);
    setCurrentTransaction(null);
    
    if (splitPaymentEnabled) {
      // Check if all split payments are completed
      const totalPaid = splitPayments.reduce((sum, p) => sum + p.amount, 0);
      if (totalPaid >= total) {
        // Show final summary instead of auto-redirecting
        setShowFinalSummary(true);
      } else {
        notificationService.info('Payment Added', 'Payment added. Continue with next payment or complete sale.');
        setCurrentSplitAmount("");
      }
    } else {
      resetPayment();
    }
  };

  const removeSplitPayment = (id: number) => {
    setSplitPayments(prev => prev.filter(p => p.id !== id));
    notificationService.info('Payment Removed', 'Split payment removed from list');
  };

  const handleFinalCompletion = () => {
    // Log the complete transaction
    transactionLogger.logTransaction({
      type: 'payment',
      method: 'cash', // Use cash as the primary method for split payments
      amount: total,
      customerId: customer?.phone,
      items: finalCart,
      discount: discountPercentage > 0 ? { percentage: discountPercentage, amount: discountAmount } : undefined,
      serviceCharge,
      tax,
      total,
      status: 'completed'
    });

    notificationService.success('Sale Complete', 'All split payments completed successfully!');
    setShowFinalSummary(false);
    resetPayment();
  };

  const handleNewSale = () => {
    setShowFinalSummary(false);
    resetPayment();
  };

  const resetPayment = () => {
    setShowCashModal(false);
    setShowCardModal(false);
    setShowKokoModal(false);
    setShowReceiptModal(false);
    setShowFinalSummary(false);
    setSelectedPayment("cash");
    setSplitPaymentEnabled(false);
    setSplitPayments([]);
    setCurrentSplitAmount("");
    setCurrentTransaction(null);
    navigate("/home");
  };

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex flex-col w-full h-screen bg-gray-80 transition-all duration-300">
        <TopBar />
        <div className="flex-1 flex">

          {/* Main Payment Area */}
          <div className="w-[75%] p-5 overflow-y-auto">

            {/* Customer Information */}
            {customer && (
              <div className="w-full flex flex-col gap-1 p-3 rounded-lg justify-end">
                <h3 className="font-semibold mb-2 text-gray-800">Customer Information</h3>
                <p className="text-base text-gray-700"> {customer.name}</p>
                <p className="text-base text-gray-700"> {customer.phone}</p>
                <p className="text-base text-gray-700">Loyalty Points: {customer.loyaltyPoints}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm">
              {/* Split Payment Manager - Always show when enabled */}
              {splitPaymentEnabled && (
                <SplitPaymentManager
                  splitPayments={splitPayments}
                  onAddPayment={addSplitPayment}
                  onRemovePayment={removeSplitPayment}
                  onCompletePayment={completeSplitPayment}
                  remainingAmount={remainingAmount}
                  totalAmount={total}
                  selectedPayment={selectedPayment}
                  onPaymentSelect={handlePaymentSelect}
                />
              )}

              {/* Payment Method Selector */}
              <PaymentMethodSelector
                selectedPayment={selectedPayment}
                onPaymentSelect={handlePaymentSelect}
                disabled={splitPaymentEnabled && remainingAmount <= 0}
              />

              {/* Action Buttons */}
              <div className="flex gap-4 p-6">
                <button
                  onClick={() => setSplitPaymentEnabled(!splitPaymentEnabled)}
                  className={`w-full py-4 font-bold transition-colors ${
                    splitPaymentEnabled 
                      ? "bg-green-500 text-white hover:bg-green-600" 
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {splitPaymentEnabled ? "SPLIT PAYMENT ACTIVE ✅" : "ENABLE SPLIT PAYMENT"}
                </button>
                {!splitPaymentEnabled && (
                  <button
                    onClick={handleConfirmPayment}
                    disabled={!selectedPayment}
                    className={`w-full py-4 font-bold transition-colors ${
                      selectedPayment
                        ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    MAKE PAYMENT
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Payment Summary Sidebar */}
          <PaymentSummary
            cart={finalCart}
            calculations={calculations}
            discountPercentage={discountPercentage}
            discountAmount={discountAmount}
            serviceCharge={serviceCharge}
            total={total}
            onSetDiscount={setDiscountPercentage}
            onRemoveItem={removeItem}
            onCancelSale={resetPayment}
          />
        </div>

        {/* Payment Modals */}
        <CashPaymentModal
          isOpen={showCashModal}
          onClose={() => setShowCashModal(false)}
          onConfirm={handleCashPayment}
          totalAmount={total}
          isSplitPayment={splitPaymentEnabled}
          splitAmount={parseFloat(currentSplitAmount)}
        />

        <CardPaymentModal
          isOpen={showCardModal}
          onClose={() => setShowCardModal(false)}
          onConfirm={handleCardPayment}
          totalAmount={total}
          isSplitPayment={splitPaymentEnabled}
          splitAmount={parseFloat(currentSplitAmount)}
        />

        <KokoPaymentModal
          isOpen={showKokoModal}
          onClose={() => setShowKokoModal(false)}
          onConfirm={handleKokoPayment}
          totalAmount={total}
          isSplitPayment={splitPaymentEnabled}
          splitAmount={parseFloat(currentSplitAmount)}
        />

        {/* Receipt Modal */}
        {showReceiptModal && currentTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-lg w-full rounded-lg shadow-xl">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800">Payment Receipt</h3>
                <p className="text-sm text-gray-600">Receipt: {currentTransaction.receiptNumber}</p>
              </div>

              <div className="p-3 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="font-semibold mb-2">Transaction Summary</h2>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-lg">
                      <span>Date:</span>
                      <span>{currentTransaction.timestamp.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Method:</span>
                      <span className="capitalize">{currentTransaction.method}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Amount:</span>
                      <span className="font-bold">{formatCurrency(currentTransaction.amount)}</span>
                    </div>
                    {currentTransaction.change && (
                      <div className="flex justify-between text-lg">
                        <span>Change:</span>
                        <span className="font-bold">{formatCurrency(currentTransaction.change)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handlePrintReceipt}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                  >
                    🖨️ Print Receipt
                  </button>
                  <button
                    onClick={handleCompleteSale}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                  >
                    ✅ Complete Sale
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final Sale Summary Modal */}
        {showFinalSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-2xl w-full rounded-lg shadow-xl">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-3xl font-bold text-green-600 text-center">🎉 Sale Complete!</h3>
                <p className="text-sm text-gray-600 text-center mt-2">All payments have been processed successfully</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Sale Summary */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3 text-lg">Sale Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-lg">{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Paid:</span>
                      <span className="font-bold text-lg text-green-600">{formatCurrency(totalPaid)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Methods:</span>
                      <span className="font-semibold">{splitPayments.length} split payment(s)</span>
                    </div>
                  </div>
                </div>

                {/* Split Payments Breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Payment Breakdown</h4>
                  <div className="space-y-2">
                    {splitPayments.map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {payment.method === 'cash' ? '💵' : payment.method === 'card' ? '💳' : '📱'}
                          </span>
                          <span className="capitalize font-medium">{payment.method} Payment</span>
                        </div>
                        <span className="font-bold">{formatCurrency(payment.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Info */}
                {customer && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Customer Information</h4>
                    <p className="text-sm text-gray-700"><strong>Name:</strong> {customer.name}</p>
                    <p className="text-sm text-gray-700"><strong>Phone:</strong> {customer.phone}</p>
                    <p className="text-sm text-gray-700"><strong>Loyalty Points:</strong> {customer.loyaltyPoints}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleFinalCompletion}
                    className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors"
                  >
                    ✅ Finalize Sale
                  </button>
                  <button
                    onClick={handleNewSale}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition-colors"
                  >
                    🛒 Start New Sale
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Container */}
        <NotificationContainer />
      </div>
    </div>
  );
};

export default Payment;