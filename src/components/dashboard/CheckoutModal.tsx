import { useState } from "react";
import ordersData from "../../data/Order.json";
import edc from "../../assets/edcMachine.png";
import QRCode from "react-qr-code";
import PaymentSuccess from "./PaymentSuccess";

const CheckoutModal = ({ onClosePopup }: { onClosePopup: () => void }) => {
  const [activeTab, setActiveTab] = useState("cash");
  const [confirmPopup, setconfirmPopup] = useState(false);
  const [inputAmount, setinputAmount] = useState(0);
  const [customerChange, setcustomerChange] = useState(0.0);
  const totalAmount = 4656.0;

  const tabs = [
    { key: "cash", label: "Cash" },
    { key: "card", label: "Card Payment" },
    { key: "koko", label: "Koko" },
  ];

  const calculateInputChange = (inputAmount: number) => {
    const value = inputAmount - 4656.0;
    return isNaN(value) ? 0 : setcustomerChange(value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-5xl overflow-hidden">
        {/* LEFT SIDE - RECEIPT */}
        <div className="flex flex-col w-full md:w-1/2 bg-gray-50 p-6 border-r">
          <h2 className="text-xl font-bold">Sky Clouds Mobiles</h2>
          <p className="text-sm text-gray-500">
            Wed, May 27, 2025 - 9:27:53 AM
          </p>
          <div className=" font-bold text-base my-4">
            <div className="flex justify-between">
              <p>Payment ID </p>
              <p>PT561</p>
            </div>
            <div className="flex justify-between">
              <p>Cashier </p>
              <p>R. Kumaran</p>
            </div>
          </div>

          <div className="pt-4 border-t border-b py-2 text-base flex-1 overflow-y-auto">
            {ordersData.map((item, idx) => (
              <div key={idx} className="flex justify-between py-1">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-gray-500">Rs {item.unitPrice}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">× {item.quantity}</p>
                  <p className="font-bold">Rs {item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1 mt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>Rs 4220.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>
              <span>Rs 00.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax (12%)</span>
              <span>Rs 455.64</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total Amount</span>
              <span>Rs {totalAmount}</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - PAYMENT */}
        <div className="w-1/2 px-5 py-3 flex flex-col">
          <div className="hover:bg-grey-600 flex justify-end">
            <button
              className=" items-end flex justify-end"
              onClick={onClosePopup}
            >
              ❌
            </button>
          </div>
          {/* Tabs */}
          <div className="flex border-b mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-gray-500 hover:text-blue-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 mt-6 overflow-y-auto space-y-4">
            {/* CASH TAB */}
            {activeTab === "cash" && (
              <div>
                <h1 className="font-semibold text-gray-500">Amount Received</h1>
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    className="rounded-xl bg-blue-200 text-primary font-semibold text-xs mt-2  px-4 py-1"
                    onClick={() => setinputAmount(500)}
                  >
                    500
                  </button>
                  <button
                    className="rounded-xl bg-blue-200 text-primary font-semibold text-xs mt-2  px-4 py-1"
                    onClick={() => setinputAmount(1000)}
                  >
                    1000
                  </button>
                  <button
                    className="rounded-xl bg-blue-200 text-primary font-semibold text-xs mt-2  px-4 py-1"
                    onClick={() => setinputAmount(2000)}
                  >
                    2000
                  </button>
                  <button
                    className="rounded-xl bg-blue-200 text-primary font-semibold text-xs mt-2  px-4 py-1"
                    onClick={() => setinputAmount(5000)}
                  >
                    5000
                  </button>
                </div>
                <div className="flex gap-5">
                  <input
                    type="number"
                    value={inputAmount}
                    onChange={(e) => setinputAmount(Number(e.target.value))}
                    placeholder="Other Amount"
                    className="w-[80%] border rounded px-3 py-2"
                  />
                  <button
                    onClick={() => calculateInputChange(inputAmount)}
                    className="py-2 px-4 bg-primary text-white font-semibold rounded"
                  >
                    Calculate
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold">Customer Change</p>
                  <p className="text-xl font-bold">Rs {customerChange}</p>
                </div>

                <div className="mt-8 flex justify-center ">
                  <button
                    type="submit"
                    onClick={() => setconfirmPopup(true)}
                    className="px-8 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
                  >
                    Pay Now{" "}
                  </button>
                </div>
              </div>
            )}

            {/* CARD TAB */}
            {activeTab === "card" && (
              <div>
                <p className="text-sm text-red-500 font-semibold mb-2">
                  Complete payment in <span>00h 24m 54s</span>
                </p>
                <div className="flex flex-col items-center justify-center border rounded-lg p-6 text-center bg-gray-50">
                  <img src={edc} alt="Card Machine" className="w-24 mb-3" />
                  <p className="font-semibold">
                    Tap or Swipe card at EDC Machine
                  </p>
                  <p className="text-sm text-gray-500">
                    Follow instructions on the EDC machine.
                  </p>
                </div>
                <div className="flex gap-2 justify-center border-t pt-4 mt-4">
                  <span className="font-semibold text-lg">
                    Total Payment -{" "}
                  </span>
                  <span className="font-semibold text-lg">
                    Rs {totalAmount}
                  </span>
                </div>
              </div>
            )}

            {/* KOKO TAB */}
            {activeTab === "koko" && (
              <div>
                <p className="text-sm text-blue-500 font-semibold my-4 text-center">
                  Scan below QR code to{" "}
                  <span>pay the rest over 60 days with 0% interest</span>
                </p>
                <div
                  className="max-w-60 h-60 w-[100%]"
                  style={{ height: "auto", margin: "0 auto", width: "100%" }}
                >
                  <QRCode
                    value={"Thank You! for your payment"}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                  />
                </div>

                <div className="flex gap-2 justify-center border-t pt-4 mt-4">
                  <span className="font-semibold text-lg">
                    Total Payment -{" "}
                  </span>
                  <span className="font-semibold text-lg">
                    Rs {totalAmount}
                  </span>
                </div>
              </div>
            )}

            {confirmPopup && (
              <PaymentSuccess
                onClose={() => setconfirmPopup(false)}
                totalAmount={totalAmount}
                inputAmount={inputAmount}
                customerChange={customerChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
