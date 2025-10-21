import type { Customer } from "../../datatypes/customerTypes";

interface Props {
  data: Customer[];
}

const CustomersTable = ({ data }: Props) => {
  return (
    <div>
      <table className="w-full mt-6 rounded-[30px] bg-white">
        <thead>
          <tr>
            <th className="py-3 border-b">ID</th>
            <th className="py-3 border-b">Name</th>
            <th className="py-3 border-b">Phone</th>
            <th className="py-3 border-b">Total Visits</th>
            <th className="py-3 border-b">Last Visit</th>
            <th className="py-3 border-b">Loyalty Points</th>
            <th className="py-3 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((customer) => (
              <tr
                key={customer.id}
                className="odd:bg-gray-50 hover:bg-blue-50 transition"
              >
                <td className="px-14 py-5 border-b">{customer.id}</td>
                <td className="px-14 py-5 border-b">{customer.name}</td>
                <td className="px-14 py-5 border-b">{customer.phone}</td>
                <td className="px-14 py-5 border-b">{customer.totalVisit}</td>
                <td className="px-14 py-5 border-b">{customer.lastVisit}</td>
                <td className="px-14 py-5 border-b">
                  {customer.loyaltyPoints}
                </td>
                <td className="px-14 py-5 border-b text-blue-600 font-semibold">
                  View Profile
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 py-6 italic">
                No Customer Records Found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
