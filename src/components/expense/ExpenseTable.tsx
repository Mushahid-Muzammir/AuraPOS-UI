import type { Expense } from "../../datatypes/expenseTypes.ts";

interface Props {
  data: Expense[];
}

const ExpenseTable = ({ data }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead className="bg-blue-50 text-gray-700 text-sm uppercase">
          <tr>
            <th className="px-5 py-3 border-b">ID</th>
            <th className="px-5 py-3 border-b">Description</th>
            <th className="px-5 py-3 border-b">Amount (Rs.)</th>
            <th className="px-5 py-3 border-b">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((expense) => (
              <tr
                key={expense.id}
                className="odd:bg-gray-50 hover:bg-blue-50 transition"
              >
                <td className="px-5 py-3 border-b">{expense.id}</td>
                <td className="px-5 py-3 border-b">{expense.description}</td>
                <td className="px-5 py-3 border-b text-blue-600 font-semibold">
                  {expense.amount.toLocaleString()}
                </td>
                <td className="px-5 py-3 border-b">{expense.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 py-6 italic">
                No expenses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
