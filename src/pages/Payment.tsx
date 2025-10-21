import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "../components/common/TopBar";
import SideBar from "../components/common/SideBar";
import type { PaymentProps } from "../datatypes/propTypes.ts";
import cash from "../assets/cash.svg";
import card from "../assets/card.svg";
import koko from "../assets/koko.svg";
import type { Discount, PaymentMethods } from "../datatypes/saleTypes.ts";
import  ApplyDiscount from "../components/checkout/ApplyDiscount.tsx";


const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethods>('cash');
  const [showModal, setShowModal] = useState(false);
  const [cashReceived, setCashReceived] = useState("");
  const [kokoPhone, setKokoPhone] = useState("");
  const [kokoProcessing, setKokoProcessing] = useState(false);
  const [kokoStatus, setKokoStatus] = useState<
    "waiting" | "success" | "failed" | null
  >(null);

  const paymentData = location.state as PaymentProps;
    const { cart, customer, calculations } = paymentData;

  const [discountPercentage, setDiscountPercentage] = useState<Discount["value"]>(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const removeItem = (id: number) => {
    cart.filter((item) => item.id !== id);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const serviceCharge = subtotal * 0.025; 
  
  const total = subtotal + serviceCharge - discountAmount;


  // Redirect if no data
  useEffect(() => {
    if (!paymentData || !paymentData.cart || paymentData.cart.length === 0) {
      navigate("/home");
    }
    if (discountPercentage > 0) {
    setDiscountAmount(total * discountPercentage * 0.01);
  } else {
    setDiscountAmount(0);
  }
  }, [paymentData, navigate,  discountPercentage, total]);

  

  const handlePaymentSelect = (method: PaymentMethods) => {
    setSelectedPayment(method);
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) return;
    setShowModal(true);
  };

  const handleCashPayment = () => {
    const received = parseFloat(cashReceived);
    if (received >= total) {
      alert(
        "💵 Cash Drawer Opening...\n\nPayment Successful!\nChange: LKR " +
          (received - total).toFixed(2)
      );
      resetPayment();
    }
  };

  const change = parseFloat(cashReceived || "0") - total;

  const handleCardPayment = () => {
    // Simulate card processing
    setTimeout(() => {
      alert("✅ Card Payment Successful!\n\nTransaction approved.");
      resetPayment();
    }, 2000);
  };

  const handleKokoPayment = () => {
    if (kokoPhone.length !== 10) return;

    setKokoProcessing(true);
    setKokoStatus("waiting");

    setTimeout(() => {
      setKokoProcessing(false);
      setKokoStatus("success");

      setTimeout(() => {
        alert(
          "✅ Koko Payment Successful!\n\nCustomer has approved the payment on their device."
        );
        resetPayment();
      }, 1500);
    }, 3000);
  };

  const resetPayment = () => {
    setShowModal(false);
    setSelectedPayment("cash");
    setCashReceived("");
    setKokoPhone("");
    setKokoProcessing(false);
    setKokoStatus(null);
    cart.length = 0; 
    navigate("/home");
  };

  const formatCurrency = (amount: number) => {
    return `LKR ${amount.toFixed(2)}`;
  };

  const quickCashAmounts = [
    { label: "5,000", value: 5000 },
    { label: "10,000", value: 10000 },
    { label: "20,000", value: 20000 },
    { label: "Exact", value: total },
  ];

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex flex-col w-full h-screen bg-gray-80 transition-all duration-300">
        <TopBar />
        <div className="flex-1 flex">
          {/* Order Details */}
          <div className="w-[75%] p-5 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-sm">

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        QTY
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Subtotal
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                              👟
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {item.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block bg-gray-100 px-4 py-1 rounded-lg font-semibold">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-800 font-bold">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            {/* <Trash2 className="w-5 h-5" /> */}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payment Methods Section */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                  Select Payment Method
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Cash */}
                  <button
                    onClick={() => handlePaymentSelect("cash")}
                    className={`p-6 bg-white rounded-xl border-2 transition-all hover:shadow-md ${
                      selectedPayment === "cash"
                        ? "border-blue-500 shadow-lg shadow-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          selectedPayment === "cash"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <img src={cash} className="object-contain" />
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          selectedPayment === "cash"
                            ? "text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        CASH
                      </span>
                    </div>
                  </button>

                  {/* Card */}
                  <button
                    onClick={() => handlePaymentSelect("card")}
                    className={`p-6 bg-white rounded-xl border-2 transition-all hover:shadow-md ${
                      selectedPayment === "card"
                        ? "border-blue-500 shadow-lg shadow-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          selectedPayment === "card"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <img src={card} className="object-cover" />
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          selectedPayment === "card"
                            ? "text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        CARD
                      </span>
                    </div>
                  </button>

                  {/* Koko */}
                  <button
                    onClick={() => handlePaymentSelect("koko")}
                    className={`p-6 bg-white rounded-xl border-2 transition-all hover:shadow-md ${
                      selectedPayment === "koko"
                        ? "border-blue-500 shadow-lg shadow-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          selectedPayment === "koko"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <img src={koko} className="object-cover" />
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          selectedPayment === "koko"
                            ? "text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        KOKO
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* CONFIRM PAYMENT Button */}
              <div className="p-6">
                <button
                onClick={handleConfirmPayment}
                disabled={!selectedPayment}
                className={`w-full py-4 font-bold rounded-lg transition-colors ${
                  selectedPayment
                    ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}>
                 CONFIRM PAYMENT
                </button>
              </div>
            </div>
          </div>

          {/* Payment Summary Sidebar */}
          <div className="w-[25%] h-[100%] bg-white flex flex-col gap-4 justify-between items-center border px-2 py-4 rounded-lg">
            {customer && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <p className="text-sm">Name: {customer.name}</p>
            <p className="text-sm">Phone: {customer.phone}</p>
          </div>
        )}
            <div className="w-full px-4  rounded-lg shadow-lg border border-grey-400">
              <ApplyDiscount onSetDiscount= {setDiscountPercentage} />
            </div>


              <div className="w-full flex flex-col gap-4 p-6 border-t border-gray-200">
                
                <div className="flex flex-row justify-between w-full">
                  <div className="text-gray-600">Subtotal</div>
                  <div className="text-gray-600">Rs {calculations.subtotal.toFixed(2)}</div>
                </div>
                <div className="flex flex-row justify-between w-full">
                  <div className="text-green-400">Discount ({discountPercentage}% )</div>
                  <div className="text-green-400">- Rs {discountAmount.toFixed(2)}</div>
                </div>
                <div className="flex flex-row justify-between w-full">
                  <div className="text-red-400">Tax</div>
                  <div className="text-red-400">+ Rs {calculations.tax.toFixed(2)}</div>
                </div>
                <div className="flex flex-row justify-between w-full pb-4 border-b">
                  <div className="text-gray-600">Service Charge</div>
                  <div className="text-gray-600">Rs {((calculations.subtotal * 0.025)).toFixed(2)}</div>
                </div>
                <div className="flex flex-row justify-between w-full mt-4">
                  <div className="font-bold text-2xl">Total</div>
                  <div className="text-2xl font-bold">Rs {total.toFixed(2)}</div>
                </div>

            </div>

            <div className="w-full p-6 border-t border-gray-200">
              <button
                onClick={resetPayment}
                className="w-full py-4 bg-red-500 text-white font-bold rounded-lg transition-colors">
                 CANCEL SALE 
              </button>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-lg w-full">
              
              {/* Cash Payment */}
              {selectedPayment === "cash" && (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <img src={cash} className="object-cover" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Cash Payment
                      </h3>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {total.toFixed(2)}
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
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {quickCashAmounts.map((amount) => (
                        <button
                          key={amount.label}
                          onClick={() =>
                            setCashReceived(amount.value.toString())
                          }
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors"
                        >
                          {amount.label}
                        </button>
                      ))}
                    </div>

                    {cashReceived && parseFloat(cashReceived) >= total && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-700 font-semibold mb-1">
                          Change to Return
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(parseFloat(change.toString()))}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCashPayment}
                        disabled={
                          !cashReceived || parseFloat(cashReceived) < total
                        }
                        className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                          cashReceived && parseFloat(cashReceived) >= total
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Complete Payment
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Card Payment */}
              {selectedPayment === "card" && (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <img src={card} className="object-cover" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Card Payment
                      </h3>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-3xl font-bold text-blue-600">
                       Rs. {total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <p className="font-bold text-yellow-800">
                          Waiting for Card
                        </p>
                      </div>
                      <p className="text-sm text-yellow-700">
                        Please insert, tap, or swipe their card on the payment
                        terminal.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCardPayment}
                        className="flex-1 py-3 bg-primary hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        Process Payment
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Koko Payment */}
              {selectedPayment === "koko" && (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <img src={koko} className="object-cover" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Koko Payment
                      </h3>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-3xl font-bold text-blue-600">
                        Rs. {total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {kokoStatus === null && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Customer Mobile Number
                          </label>
                          <input
                            type="tel"
                            value={kokoPhone}
                            onChange={(e) =>
                              setKokoPhone(
                                e.target.value.replace(/\D/g, "").slice(0, 10)
                              )
                            }
                            placeholder="07X XXX XXXX"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Enter customer's registered Koko mobile number
                          </p>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <p className="text-sm text-purple-800">
                            <strong>Note:</strong> Customer will receive a push
                            notification on their Koko app to approve this
                            payment.
                          </p>
                        </div>
                      </>
                    )}

                    {kokoStatus === "waiting" && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          {/* <Loader2 className="w-6 h-6 text-yellow-600 animate-spin" /> */}
                          <p className="font-bold text-yellow-800">
                            Waiting for Customer Approval
                          </p>
                        </div>
                        <p className="text-sm text-yellow-700 mb-4">
                          A payment request has been sent to the customer's Koko
                          app. Please ask them to approve the transaction.
                        </p>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-xs text-gray-500 mb-2">
                            Request sent to
                          </p>
                          <p className="text-lg font-bold text-gray-800">
                            {kokoPhone}
                          </p>
                        </div>
                      </div>
                    )}

                    {kokoStatus === "success" && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          {/* <Check className="w-8 h-8 text-green-600" /> */}
                        </div>
                        <p className="text-xl font-bold text-green-800 mb-2">
                          Payment Approved!
                        </p>
                        <p className="text-sm text-green-700">
                          The customer has successfully approved the payment.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowModal(false)}
                        disabled={kokoProcessing}
                        className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleKokoPayment}
                        disabled={
                          kokoPhone.length !== 10 ||
                          kokoProcessing ||
                          kokoStatus !== null
                        }
                        className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                          kokoPhone.length === 10 &&
                          !kokoProcessing &&
                          kokoStatus === null
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {kokoProcessing}
                        {kokoStatus === null
                          ? "Send Payment Request"
                          : "Processing..."}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
