import type { TotalProps } from '../../datatypes/propTypes';


const Total = ({ subtotal , discount, tax, total }: TotalProps) => {
  return (
    <div className="flex flex-col w-full gap-2 px-4">

      <div className="flex flex-row mt-3 justify-between w-full">
        <div className="text-black font-bold">Sub Total</div>
        <div className="text-base font-semibold">Rs {subtotal.toFixed(2)}</div>
      </div>
      <div className="flex flex-row mt-1 justify-between w-full">
        <div className="text-black font-bold">Discount</div>
        <div className="text-green-400 text-base font-semibold">- Rs {discount.toFixed(2)}</div>
      </div>
      <div className="flex flex-row mt-1 justify-between w-full">
        <div className="text-black font-bold">Tax</div>
        <div className="text-red-400 text-base font-semibold">+ Rs {tax.toFixed(2)}</div>
      </div>

      <hr className="border border-gray-300 mt-6" />

      <div className="flex flex-row mt-3 justify-between w-full">
        <div className="font-bold text-2xl">Total</div>
        <div className="text-2xl font-bold">Rs {total.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default Total;
