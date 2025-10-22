import type { TotalProps } from '../../datatypes/propTypes';


const Total = ({ subtotal  }: TotalProps) => {
  return (
    <div className="flex flex-col w-full gap-2 px-4">

      <hr className="border border-gray-300 mt-6" />

      <div className="flex flex-row mt-3 justify-between w-full">
        <div className="text-black font-bold">Sub Total</div>
        <div className="text-base font-semibold">Rs {subtotal.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default Total;
