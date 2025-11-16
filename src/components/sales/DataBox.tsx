import type { SaleRecord } from "../../interfaces/saleInterface.ts";
import SaleLogo from "../../assets/sales_logo.svg";

interface DataBoxProps {
  data: SaleRecord[];
}

const DataBox = ({ data }: DataBoxProps) => {
  return (
    <>
      {data.map((item, index) => (
        <div
          key={index}
          className="w-[30%] justify-between mt-6 ml-8 bg-white rounded-lg border"
        >
          <div className="flex flex-col gap-3 m-6 overflow-hidden">
            <div className="flex justify-start gap-4">
              <img className="w-7 h-7" src={SaleLogo} alt="Sales Logo" />
              <p className="font-semibold text-base text-black">{item.title}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-bold text-3xl text-[#19191c]">{item.value}</p>
              <div className="h-6">
                <div className="flex gap-2 h-12">
                  <p className="font-semibold text-left text-[#73cb50]">
                    {item.percentage}%
                  </p>
                  <p className="font-medium text-left text-[#828487]">
                    from last month
                  </p>
                </div>
              </div>
            </div>
            <p className="font-semibold text-blue-500 cursor-pointer">
              View detail
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default DataBox;
