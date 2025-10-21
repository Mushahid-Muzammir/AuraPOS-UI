import type { Sale } from "../../datatypes/saleTypes";

interface Props {
  data: Sale[];
}

const SalesTable = ({ data }: Props) => {
  return (
    <div>
      <table className="w-full mt-6 rounded-[30px] bg-white">
        <thead>
          <tr>
            <th className="px-8 py-3 border-b">ID</th>
            <th className="px-8 py-3 border-b">Product</th>
            <th className="px-8 py-3 border-b">Contact</th>
            <th className="px-8 py-3 border-b">Date</th>
            <th className="px-8 py-3 border-b">Time</th>
            <th className="px-8 py-3 border-b">Quantity</th>
            <th className="px-8 py-3 border-b">Total</th>
            <th className="px-8 py-3 border-b">Payment Method</th>
            <th className="px-8 py-3 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((sale) => (
              <tr
                key={sale.id}
                className="odd:bg-gray-50 hover:bg-blue-50 transition"
              >
                <td className="px-8 py-5 border-b">{sale.id}</td>
                <td className="px-8 py-5 border-b">{sale.product}</td>
                <td className="px-8 py-5 border-b">{sale.contact}</td>
                <td className="px-8 py-5 border-b">{sale.date}</td>
                <td className="px-8 py-5 border-b">{sale.time}</td>
                <td className="px-8 py-5 border-b">{sale.quantity}</td>
                <td className="px-8 py-5 border-b">{sale.total}</td>
                <td className="px-8 py-5 border-b">{sale.payment_method}</td>
                <td className="px-8 py-5 border-b text-blue-600 font-semibold">
                  View Bill
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 py-6 italic">
                No Sale Records Found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
