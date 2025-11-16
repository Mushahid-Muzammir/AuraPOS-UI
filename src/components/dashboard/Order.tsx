import type { OrderProps } from "../../interfaces/propTypes";
import cartEmpty from '../../assets/cartEmpty.svg'

const Order = ({ cart, onUpdateQuantity, onRemoveItem } : OrderProps) => {

  return (
    <div className="flex flex-col w-full h-full p-2 gap-2 m-2 scroll">
      {cart.length === 0 ? (
        <p className="text-lg font-semibold text-center py-8">
        Add Items to Cart! <img src={cartEmpty} alt="Cart is empty" className="w-16 h-16 mx-auto mt-2" />
        </p>
      ) : (
      <div className="max-h-72 overflow-y-auto pr-2">
        {cart.map((item) => (
          <div key={item.id} className="flex flex-row gap-2">
            <img
                src={item.image}
                className="w-12 h-14 rounded-md object-cover self-center"
                alt={item.name}
              />
            <div className="flex flex-col gap-3 w-full">
              <div className="text-md font-semibold">{item.name}</div>
              
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <div className="font-bold text-md text-primary">
                    Rs {item.price.toFixed(2)}
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="rounded-full bg-gray-300 w-6 h-6">
                    -
                  </button>
                  <div className="font-bold text-sm">{item.quantity}</div>
                  <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="rounded-full text-white bg-black w-6 h-6">
                    +
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-black hover:text-red-700 text-base"
                  >
                    ×
                  </button>
                </div>
              </div>
              <hr className="border border-gray-300" />
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

export default Order;
