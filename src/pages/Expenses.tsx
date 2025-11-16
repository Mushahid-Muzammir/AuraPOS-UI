import { useMemo, useState } from "react";
import TopBar from "../components/common/TopBar.tsx";
import SideBar from "../components/common/SideBar.tsx";
import ExpenseCard from "../components/expense/ExpenseCard";
import ExpenseTable from "../components/expense/ExpenseTable.tsx";
import ExpenseFormModal from "../components/expense/ExpenseFormModal.tsx";
import SearchAndFilterBar from "../components/common/SearchAndFilterBar.tsx";
import Pagination from "../components/common/Pagination.tsx";
import expensesData from "../data/expense.json";
import { toast } from "sonner";
import type { Expense, DataCard } from "../interfaces/expenseInterface.ts";

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(
    expensesData as Expense[]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const rowsPerPage = 5;

  const displayDataCard: DataCard[] = [
    {
      title: "Today Expenses",
      amount: 3200.0,
      img: "images/expenses.svg",
      percentage: 9,
    },
    {
      title: "Total Income",
      amount: 1020.0,
      img: "images/revenue.svg",
      percentage: 5,
    },
    {
      title: "Current Balance",
      amount: 4220.0,
      img: "images/sales.svg",
      percentage: 11,
    },
  ];

  const filteredExpenses = useMemo(() => {
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

  const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage);
  const currentData = filteredExpenses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses([...expenses, newExpense]);
    toast.success("Expense added successfully!");
    setShowForm(false);
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
        </main>
      </div>

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
