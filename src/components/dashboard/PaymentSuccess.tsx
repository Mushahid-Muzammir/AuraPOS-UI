import success from '../../assets/success.png'

export const PaymentSuccess = ({ onClose, totalAmount, inputAmount, customerChange }: { onClose: () => void; totalAmount: number | string; inputAmount: number | string; customerChange: number | string }) => {
  return (
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-96 rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center">
          <img src={success} alt="Success" className="text-blue-500 w-14 h-14" />
          <h2 className="text-lg font-semibold mt-3">Payment Successful!</h2>
          <p className="text-gray-500 text-sm">
            Don’t forget to say Thank You to customers
          </p>
        </div>

        {/* Payment Details */}
        <div className="mt-4 border rounded-lg overflow-hidden">
          <div className=" px-4 py-2 text-lg font-semibold text-gray-700">
            Payment Details
          </div>
          <div className="px-4 py-3 space-y-3 text-base">
            <div className="flex justify-between ">
              <span>Total Payment</span>
              <span className="font-medium">Rs.{totalAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Payment Method</span>
              <span className="flex items-center text-blue-500 font-medium">
                 Cash
              </span>
            </div>
            <div className="flex justify-between">
              <span>Customer Pays</span>
              <span className="font-medium">Rs.{inputAmount}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Change</span>
              <span className="text-black">Rs.{customerChange}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button className="flex items-center justify-center gap-2 border w-1/2 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={onClose}>
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white w-1/2 py-2 rounded-lg">
            Print Bill
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess;
