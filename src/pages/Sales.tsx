import { useState, useMemo, useEffect } from "react";
import TopBar from "../components/common/TopBar";
import SideBar from "../components/common/SideBar";
import SalesTable from "../components/sales/SalesTable.tsx";
import Pagination from "../components/common/Pagination.tsx";
import SearchAndFilterBar from "../components/common/SearchAndFilterBar.tsx";
import type { Sale } from "../interfaces/saleInterface.ts";
import { useSales, useSalesByDate } from "../hooks/useSales";

export const Sales = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: salesData, isLoading, isError, error } = useSales({ 
    page: currentPage, 
    pageSize: 5,
    search: searchTerm 
  });

  const { data: dateFilteredSales, isLoading: isLoadingByDate } = useSalesByDate(
    startDate || new Date().toISOString().split('T')[0],
    endDate || new Date().toISOString().split('T')[0]
  );

  const sales = (startDate && endDate && dateFilteredSales) ? dateFilteredSales : (salesData?.sales || salesData?.products || []);

  const filteredSales = useMemo(() => {
    if (!sales) return [];
    return sales.filter((item) => {
      const matchSearch =
        item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contact?.toString().includes(searchTerm) ||
        item.customerId?.toString().includes(searchTerm);
      const matchStart = startDate
        ? new Date(item.saleDate) >= new Date(startDate)
        : true;
      const matchEnd = endDate
        ? new Date(item.saleDate) <= new Date(endDate)
        : true;
      return matchSearch && matchStart && matchEnd;
    });
  }, [sales, searchTerm, startDate, endDate]);

  const rowsPerPage = 5;
  const totalPages = salesData?.totalPages || Math.ceil(filteredSales.length / rowsPerPage);
  const currentData = filteredSales.slice(
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
            <div className="bg-white p-3 m-5 rounded-lg ">
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
              {isLoading || isLoadingByDate ? (
                <div className="p-4 text-center">Loading sales...</div>
              ) : isError ? (
                <div className="p-4 text-center text-red-500">
                  Error: {error instanceof Error ? error.message : 'Failed to load sales'}
                </div>
              ) : (
                <>
                  <section className="mt-6 bg-white rounded-xl shadow-lg">
                    <SalesTable data={currentData} />
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
