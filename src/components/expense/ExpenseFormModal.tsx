import { useState } from "react";

interface Props {
  onClose: () => void;
  onAdd: (expense: { description: string; amount: number; date: string }) => void;
}

const ExpenseFormModal = ({ onClose, onAdd }: Props) => {
  const [form, setForm] = useState({ description: "", amount: "", date: "" });

  const handleSubmit = () => {
    if (!form.description || !form.amount || !form.date) return;
    const newExpense = {
      description: form.description,
      amount: parseFloat(form.amount),
      date: form.date,
    };
    onAdd(newExpense);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Add Expense</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Expense description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFormModal;
