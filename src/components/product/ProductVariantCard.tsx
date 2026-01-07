import type { ProductVariant } from "../../interfaces/productInterface"


interface Props {
  variants: ProductVariant[];
  onClose: () => void;
  onAddToCart: (variant: ProductVariant) => void;
}

const ProductVariantCard = ({ variants, onClose, onAddToCart }: Props) => {
  return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[720px] max-h-[80vh] rounded-2xl p-6 overflow-y-auto">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Variant</h2>
          <button onClick={onClose} className="text-gray-500 text-lg">✕</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {variants.map((variant) => (
            <div
              key={variant.productVariantId}
              className="border rounded-xl p-4 flex flex-col justify-between hover:shadow-md"
            >
              <div>
                <div className="font-semibold text-sm">
                  {variant.color} / {variant.size}
                </div>

                <div className="text-sm text-gray-600 mt-1">
                  Rs {variant.sellingPrice}.00
                </div>

                <div
                  className={`text-xs mt-1 font-semibold
                    ${variant.stockLevel < 3 ? "text-red-500" : "text-green-600"}
                  `}
                >
                  Stock: {variant.stockLevel}
                </div>
              </div>

              <button
                disabled={variant.stockLevel === 0}
                onClick={() => onAddToCart(variant)}
                className="mt-3 bg-blue-500 text-white text-xs py-2 rounded-lg disabled:bg-gray-300"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>  )
}

export default ProductVariantCard