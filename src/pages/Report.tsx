import { useState } from "react";
import TopBar from "../components/common/TopBar";
import SideBar from "../components/common/SideBar";
import DataBox from "../components/sales/DataBox.tsx";
import Select from "react-select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import report from "../data/report.json";
import revenue from "../data/revenue.json";
import topsellingData from "../data/topselling.json";
import type { SaleRecord } from "../interfaces/saleInterface.ts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  PointElement,
  LineElement,
  Legend
);

interface Order {
  id: string | number;
  name: string;
  price: number;
  image: string;
}

interface RevenueData {
  month: string;
  revenue: number;
}

interface SelectOption {
  value: string;
  label: string;
}

const Report = () => {
  const [orders] = useState<Order[]>(topsellingData as Order[]);

  const selectOptions: SelectOption[] = [
    { value: "daily", label: "Daily" },
    { value: "month", label: "Current" },
    { value: "last+month", label: "Last Month" },
    { value: "year", label: "Current Year" },
  ];

  const chartData: SaleRecord[] = report as SaleRecord[];
  const revenueData: RevenueData[] = revenue as RevenueData[];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Revenue Over Time",
      },
    },
  };

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex flex-col w-full h-auto bg-gray-80 transition-all duration-300">
        <TopBar />
        <div className="flex flex-row w-full px-6">
          <div className="flex flex-col w-full mt-1 ml-1">
            <div className="flex flex-col justify-start w-[95%] ml-4">
              <div className="flex flex-row justify-between gap-2 mt-3">
                <div className="flex gap-2">
                  <Select
                    className="w-40"
                    placeholder="Daily"
                    options={selectOptions}
                  />
                  <Select
                    className="w-40"
                    placeholder="Category"
                    options={selectOptions}
                  />
                  <Select
                    className="w-40"
                    placeholder="Product"
                    options={selectOptions}
                  />
                  <input
                    placeholder="Today"
                    type="date"
                    className="w-40 h-10 rounded-lg border p-2"
                  />
                </div>
                <div>
                  <button className="px-6 py-3 rounded-lg bg-[#5d90f4]">
                    <p className="text-base font-medium text-center text-white">
                      Generate Report
                    </p>
                  </button>
                </div>
              </div>
              <div className="flex flex-row justify-even">
                <DataBox data={chartData} />
              </div>
              <div className="flex flex-row gap-4 w-full justify-around mt-4">
                <div className="bg-white rounded-lg w-1/2 p-2 border">
                  <Line
                    data={{
                      labels: revenueData.map((data) => data.month),
                      datasets: [
                        {
                          label: "Revenue",
                          data: revenueData.map((data) => data.revenue),
                          borderColor: "#5d90f4",
                          backgroundColor: "rgba(93, 144, 244, 0.2)",
                          fill: true,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
                <div className="bg-white w-1/2 rounded-lg p-3 border">
                  <div className="flex flex-col p-2 gap-2 m-2">
                    <h1 className="font-bold text-xl pl-1 mb-3">
                      Top Sellings
                    </h1>
                    <div className="h-auto max-h-96 overflow-y-auto">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex flex-row gap-1 overflow-y-auto border border-gray-300 rounded-md p-1 mb-1"
                        >
                          <img
                            src={new URL(order.image, import.meta.url).href}
                            className="w-12 h-14 rounded-md object-cover self-center m-1"
                            alt={order.name}
                            onError={(
                              e: React.SyntheticEvent<HTMLImageElement>
                            ) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/100";
                            }}
                          />
                          <div className="flex flex-row justify-between w-full">
                            <p className="text-md font-semibold">
                              {order.name}
                            </p>
                            <p className="font-bold text-md text-black">
                              {" "}
                              Rs {order.price.toFixed(2)}
                            </p>
                          </div>
                          <hr className="border border-gray-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
