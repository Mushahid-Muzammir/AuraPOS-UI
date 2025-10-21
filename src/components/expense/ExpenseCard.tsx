import type { DataCard } from "../../datatypes/expenseTypes.ts";

interface ExpenseCardProps {
  displayData: DataCard;
}

const ExpenseCard = ({ displayData }: ExpenseCardProps) => {
  return (
    <div className="flex flex-col space-y-2 w-[360px] h-[150px] rounded-2xl bg-white shadow-md p-3">
      <div className="w-full flex flex-col gap-3 ml-4 mt-4">
        <div className="flex flex-row gap-2">
          <img
            src={displayData.img}
            className="w-6 h-6 inline-block mr-2 filter"
            alt="dashboard icon"
          />
          <p className="text-lg font-semibold text-black">
            {displayData.title}
          </p>
        </div>
        <p className="w-full h-[38px] text-3xl font-bold text-black">
          Rs. {displayData.amount.toFixed(2)}
        </p>
        <div className="flex gap-2 h-12 text-sm">
          <p className="font-semibold text-left text-[#73cb50]">
            {displayData.percentage}%
          </p>
          <p className="font-medium text-left text-[#828487]">from last day</p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
