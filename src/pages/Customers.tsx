import { useState, useMemo } from "react";
import TopBar from "../components/common/TopBar";
import SideBar from "../components/common/SideBar";
import customersData from "../data/customers.json";
import type { Customer } from "../datatypes/customerTypes.ts";
import CustomersTable from "../components/customer/CustomersTable.tsx";
import Pagination from "../components/common/Pagination.tsx";
import SearchAndFilterBar from "../components/common/SearchAndFilterBar.tsx";

const Customers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [customers] = useState<Customer[]>(customersData as Customer[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredCustomers = useMemo(() => {
    return customers.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toString().includes(searchTerm);
      const matchStart = startDate
        ? new Date(item.lastVisit) >= new Date(startDate)
        : true;
      const matchEnd = endDate
        ? new Date(item.lastVisit) <= new Date(endDate)
        : true;
      return matchSearch && matchStart && matchEnd;
    });
  }, [customers, searchTerm, startDate, endDate]);

  const rowsPerPage = 4;
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const currentData = filteredCustomers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex flex-col w-full h-auto bg-gray-80 transition-all duration-300">
        <TopBar />
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-full mt-1 ml-1">
            <div className="bg-white p-3 m-5 rounded-lg">
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
                <CustomersTable data={currentData} />
              </section>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                onNext={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                onPageSelect={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
