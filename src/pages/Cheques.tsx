import { useState, useMemo, useEffect } from "react";
import TopBar from "../components/common/TopBar";
import SideBar from "../components/common/SideBar";
import { toast } from "sonner";

interface Cheque {
  id: number;
  chequeNumber: string;
  customerName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  type: "receive" | "give";
  status: "pending" | "cleared" | "bounced" | "cancelled";
  bankName: string;
  description: string;
}

interface FormData {
  chequeNumber: string;
  customerName: string;
  amount: string;
  issueDate: string;
  dueDate: string;
  type: "receive" | "give";
  bankName: string;
  description: string;
}

const Cheques = () => {
  const [cheques, setCheques] = useState<Cheque[]>([
    {
      id: 1,
      chequeNumber: "CHQ001",
      customerName: "John Doe",
      amount: 5000.0,
      issueDate: "2025-08-15",
      dueDate: "2025-08-25",
      type: "receive",
      status: "pending",
      bankName: "Commercial Bank",
      description: "Payment for Invoice #INV001",
    },
    {
      id: 2,
      chequeNumber: "CHQ002",
      customerName: "ABC Suppliers",
      amount: 15000.0,
      issueDate: "2025-08-20",
      dueDate: "2025-08-30",
      type: "give",
      status: "pending",
      bankName: "Sampath Bank",
      description: "Payment for raw materials",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingCheque, setEditingCheque] = useState<Cheque | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "receive" | "give">(
    "all"
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "cleared" | "bounced" | "cancelled"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    chequeNumber: "",
    customerName: "",
    amount: "",
    issueDate: "",
    dueDate: "",
    type: "receive",
    bankName: "",
    description: "",
  });

  const rowsPerPage = 5;

  // Check for due cheques and show reminders
  useEffect(() => {
    const checkDueCheques = () => {
      const today = new Date();
      const dueCheques = cheques.filter((cheque) => {
        const dueDate = new Date(cheque.dueDate);
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff <= 3 && daysDiff >= 0 && cheque.status === "pending";
      });

      dueCheques.forEach((cheque) => {
        const dueDate = new Date(cheque.dueDate);
        const today = new Date();
        const daysDiff = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 0) {
          toast.error(`Cheque ${cheque.chequeNumber} is due today!`);
        } else if (daysDiff <= 3) {
          toast.warning(
            `Cheque ${cheque.chequeNumber} is due in ${daysDiff} days`
          );
        }
      });
    };

    checkDueCheques();
    const interval = setInterval(checkDueCheques, 24 * 60 * 60 * 1000); // Check daily
    return () => clearInterval(interval);
  }, [cheques]);

  const filteredCheques = useMemo(() => {
    let filtered = cheques;

    if (searchTerm) {
      filtered = filtered.filter(
        (cheque) =>
          cheque.chequeNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          cheque.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          cheque.bankName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((cheque) => cheque.type === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((cheque) => cheque.status === filterStatus);
    }

    return filtered;
  }, [cheques, searchTerm, filterType, filterStatus]);

  const totalPages = Math.ceil(filteredCheques.length / rowsPerPage);
  const currentData = filteredCheques.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.chequeNumber ||
      !formData.customerName ||
      !formData.amount ||
      !formData.dueDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingCheque) {
      setCheques((prev) =>
        prev.map((cheque) =>
          cheque.id === editingCheque.id
            ? {
                ...formData,
                id: editingCheque.id,
                status: "pending" as const,
                amount: parseFloat(formData.amount),
              }
            : cheque
        )
      );
      toast.success("Cheque updated successfully!");
      setEditingCheque(null);
    } else {
      const newCheque: Cheque = {
        ...formData,
        id: cheques.length + 1,
        status: "pending",
        amount: parseFloat(formData.amount),
      };
      setCheques((prev) => [...prev, newCheque]);
      toast.success("Cheque added successfully!");
    }

    setFormData({
      chequeNumber: "",
      customerName: "",
      amount: "",
      issueDate: "",
      dueDate: "",
      type: "receive",
      bankName: "",
      description: "",
    });
    setShowForm(false);
  };

  const handleEdit = (cheque: Cheque) => {
    setFormData({
      ...cheque,
      amount: cheque.amount.toString(),
    });
    setEditingCheque(cheque);
    setShowForm(true);
  };

  const handleStatusChange = (id: number, newStatus: Cheque["status"]) => {
    setCheques((prev) =>
      prev.map((cheque) =>
        cheque.id === id ? { ...cheque, status: newStatus } : cheque
      )
    );
    toast.success(`Cheque status updated to ${newStatus}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this cheque?")) {
      setCheques((prev) => prev.filter((cheque) => cheque.id !== id));
      toast.success("Cheque deleted successfully!");
    }
  };

  const getStatusBadge = (status: Cheque["status"]) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      cleared: "bg-green-100 text-green-800",
      bounced: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return statusStyles[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type: Cheque["type"]) => {
    return type === "receive" ? "text-green-600" : "text-red-600";
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex flex-col w-full h-auto bg-gray-80 transition-all duration-300">
        <TopBar />
        <div className="flex flex-row w-full h-screen">
          <div className="flex flex-col w-full mt-1 ml-1">
            {/* Summary Cards */}
            <div className="flex flex-row justify-between gap-8 mx-8 my-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 flex-1">
                <h3 className="text-lg font-semibold text-gray-700">
                  Cheques to Receive
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  LKR{" "}
                  {cheques
                    .filter(
                      (c) => c.type === "receive" && c.status === "pending"
                    )
                    .reduce((sum, c) => sum + c.amount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {
                    cheques.filter(
                      (c) => c.type === "receive" && c.status === "pending"
                    ).length
                  }{" "}
                  pending
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 flex-1">
                <h3 className="text-lg font-semibold text-gray-700">
                  Cheques to Give
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  LKR{" "}
                  {cheques
                    .filter((c) => c.type === "give" && c.status === "pending")
                    .reduce((sum, c) => sum + c.amount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {
                    cheques.filter(
                      (c) => c.type === "give" && c.status === "pending"
                    ).length
                  }{" "}
                  pending
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 flex-1">
                <h3 className="text-lg font-semibold text-gray-700">
                  Due This Week
                </h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    cheques.filter((c) => {
                      const daysDiff = getDaysUntilDue(c.dueDate);
                      return (
                        daysDiff <= 7 && daysDiff >= 0 && c.status === "pending"
                      );
                    }).length
                  }
                </p>
                <p className="text-sm text-gray-500">Cheques due soon</p>
              </div>

              <div>
                <button
                  className="text-[15px] px-4 py-3 bg-primary text-white font-semibold rounded"
                  onClick={() => {
                    setShowForm(true);
                    setEditingCheque(null);
                    setFormData({
                      chequeNumber: "",
                      customerName: "",
                      amount: "",
                      issueDate: "",
                      dueDate: "",
                      type: "receive",
                      bankName: "",
                      description: "",
                    });
                  }}
                >
                  Add Cheque
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="w-[90%] ml-4 mt-2">
              <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <input
                  type="text"
                  placeholder="Search by cheque number, customer name, or bank"
                  className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) =>
                      setFilterType(e.target.value as typeof filterType)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="receive">To Receive</option>
                    <option value="give">To Give</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(e.target.value as typeof filterStatus)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="cleared">Cleared</option>
                    <option value="bounced">Bounced</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Cheques Table */}
              <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-blue-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
                        Cheque #
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
                        Customer/Supplier
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
                        Amount
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
                        Type
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
                        Issue Date
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
                        Due Date
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
                        Days Left
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
                        Status
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
                        Bank
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((cheque) => {
                      const daysLeft = getDaysUntilDue(cheque.dueDate);
                      const isOverdue = daysLeft < 0;
                      const isDueSoon = daysLeft <= 3 && daysLeft >= 0;

                      return (
                        <tr
                          key={cheque.id}
                          className={`hover:bg-blue-50 odd:bg-gray-50 text-gray-700 ${
                            isOverdue
                              ? "bg-red-50"
                              : isDueSoon
                              ? "bg-yellow-50"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-3 border-b border-gray-100 font-medium">
                            {cheque.chequeNumber}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-100">
                            {cheque.customerName}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-100 font-semibold">
                            LKR {cheque.amount.toLocaleString()}
                          </td>
                          <td
                            className={`px-4 py-3 border-b border-gray-100 font-medium ${getTypeColor(
                              cheque.type
                            )}`}
                          >
                            {cheque.type === "receive" ? "← Receive" : "→ Give"}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-100">
                            {cheque.issueDate}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-100">
                            {cheque.dueDate}
                          </td>
                          <td
                            className={`px-4 py-3 border-b border-gray-100 font-medium ${
                              isOverdue
                                ? "text-red-600"
                                : isDueSoon
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {isOverdue
                              ? `${Math.abs(daysLeft)} days overdue`
                              : daysLeft === 0
                              ? "Due today"
                              : `${daysLeft} days`}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-100">
                            <select
                              value={cheque.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  cheque.id,
                                  e.target.value as Cheque["status"]
                                )
                              }
                              className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusBadge(
                                cheque.status
                              )}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="cleared">Cleared</option>
                              <option value="bounced">Bounced</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-100">
                            {cheque.bankName}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-100">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(cheque)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(cheque.id)}
                                className="text-red-600 hover:text-red-800 text-xs font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-end items-center space-x-2 mt-4">
                <button
                  className="px-3 py-1 text-sm rounded-full text-gray-700 hover:bg-blue-500 hover:text-white"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      currentPage === idx + 1
                        ? "bg-blue-500 text-white"
                        : "text-gray-700"
                    } hover:bg-blue-500 hover:text-white`}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1 text-sm rounded-full text-gray-700 hover:bg-blue-500 hover:text-white"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Cheque Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-2xl h-auto pb-3 rounded-lg shadow-lg m-4">
            <div className="w-full flex flex-col bg-white p-8 rounded-lg">
              <div className="flex flex-row justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {editingCheque ? "Edit Cheque" : "Add New Cheque"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">
                      Cheque Number *
                    </label>
                    <input
                      type="text"
                      name="chequeNumber"
                      value={formData.chequeNumber}
                      onChange={handleInputChange}
                      placeholder="Enter cheque number"
                      className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-gray-700 font-medium block mb-1">
                      Customer/Supplier Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="Enter name"
                      className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">
                      Amount (LKR) *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="text-gray-700 font-medium block mb-1">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                      required
                    >
                      <option value="receive">Cheque to Receive</option>
                      <option value="give">Cheque to Give</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-700 font-medium block mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 font-medium block mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="Enter bank name"
                    className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-medium block mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description or notes"
                    rows={3}
                    className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    {editingCheque ? "Update Cheque" : "Add Cheque"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cheques;
