import { useState } from "react"
import type { Discount } from "../../interfaces/saleInterface.ts"
import type { ApplyDisCountProps } from "../../interfaces/saleInterface.ts";

const ApplyDiscount = ({ onSetDiscount }: ApplyDisCountProps) => {
    const [discountPercentage, setDiscountPercentage] = useState(null as Discount["value"] | null);

    const discountData = [
        { type: "none", description: "No Discount", value : 0  },
        { type: "seasonal", description: "Seasonal Discount", value: 10 },
        { type: "clearance", description: "Clearance Sale", value: 20 },
        { type: "loyalty", description: "Loyalty Discount", value: 5 },
    ]

    const handleDiscountFormSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSetDiscount(discountPercentage || 0);
    }

  return (
    <div className="w-full flex flex-col gap-2 p-2 bg-white">
        <>
          <form
          onSubmit={handleDiscountFormSubmit}
           className="mb-4">
            <select
              className="w-full border py-2 px-3 mb-4 rounded-lg"
                value={discountPercentage || undefined}
              onChange={(e) => setDiscountPercentage(Number(e.target.value as unknown as Discount["value"]))}
            >
                {discountData.map((discount) => (
                    <option
                      key={discount.type}
                      value={discount.value}
                    >
                      {discount.description} - {discount.value}%
                    </option>
                ))}
            </select>

            <button
              onClick={() => {
                onSetDiscount(discountPercentage || 0);
              }}
              type="submit"
              className="w-full bg-primary text-white font-semibold p-2"
            >
              Set Discount
            </button>
          </form>
        </>
    </div>
  )
}

export default ApplyDiscount