import { useMemo, useState } from "react";
import TopBar from "../components/common/TopBar.tsx";
import SideBar from "../components/common/SideBar.tsx";
import ExpenseCard from "../components/expense/ExpenseCard";
import ExpenseTable from "../components/expense/ExpenseTable.tsx";
import ExpenseFormModal from "../components/expense/ExpenseFormModal.tsx";
import SearchAndFilterBar from "../components/common/SearchAndFilterBar.tsx";
import Pagination from "../components/common/Pagination.tsx";
import { useExpenses, useCreateExpense } from "../hooks/useExpenses";
import type { DataCard } from "../interfaces/expenseInterface.ts";

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const { data: expensesData, isLoading, isError, error } = useExpenses({ 
    page: currentPage, 
    pageSize: 5,
    search: searchTerm 
  });
  const createExpenseMutation = useCreateExpense();

  const expenses = expensesData?.expenses || [];

  const rowsPerPage = 5;

  // Calculate summary cards from expenses data
  const today = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses.filter(e => e.date === today).reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const displayDataCard: DataCard[] = [
    {
      title: "Today Expenses",
      amount: todayExpenses,
      img: "images/expenses.svg",
      percentage: 9,
    },
    {
      title: "Total Expenses",
      amount: totalExpenses,
      img: "images/revenue.svg",
      percentage: 5,
    },
    {
      title: "Total Count",
      amount: expenses.length,
      img: "images/sales.svg",
      percentage: 11,
    },
  ];

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    return expenses.filter((item) => {
      const matchSearch =
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.amount.toString().includes(searchTerm);
      const matchStart = startDate
        ? new Date(item.date) >= new Date(startDate)
        : true;
      const matchEnd = endDate
        ? new Date(item.date) <= new Date(endDate)
        : true;
      return matchSearch && matchStart && matchEnd;
    });
  }, [expenses, searchTerm, startDate, endDate]);

  const totalPages = expensesData?.totalPages || Math.ceil(filteredExpenses.length / rowsPerPage);
  const currentData = filteredExpenses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleAddExpense = async (newExpense: { description: string; amount: number; date: string }) => {
    try {
      await createExpenseMutation.mutateAsync(newExpense);
      setShowForm(false);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex flex-col w-full h-auto bg-gray-80 transition-all duration-300">
        <TopBar />

        <main className="px-8 py-6">
          <section className="flex flex-row justify-around mb-6 ">
            {displayDataCard.map((card, index) => (
              <ExpenseCard key={index} displayData={card} />
            ))}
          </section>

          <div className="mb-6">
            <SearchAndFilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </div>
          {isLoading ? (
            <div className="p-4 text-center">Loading expenses...</div>
          ) : isError ? (
            <div className="p-4 text-center text-red-500">
              Error: {error instanceof Error ? error.message : 'Failed to load expenses'}
            </div>
          ) : (
            <>
              <section className="mt-6 bg-white rounded-xl shadow-lg">
                <ExpenseTable data={currentData} />
              </section>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                onPageSelect={setCurrentPage}
              />
            </>
          )}
        </main>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg font-semibold"
      >
        + Add Expense
      </button>
      {showForm && (
        <ExpenseFormModal
          onClose={() => setShowForm(false)}
          onAdd={handleAddExpense}
        />
      )}
    </div>
  );
};

export default Expenses;
