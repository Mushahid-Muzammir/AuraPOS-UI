import product1 from "../assets/product1.jpg";

const Card = () => {
  return (
    <div className="border border-[#cfcfcf] rounded-xl bg-white w-[400px] h-[150px] p-4">
      <div className="flex flex-row h-full rounded-[15px]">
        <img
          src={product1}
          alt="Product"
          className="w-[25%] h-full rounded-[15px] object-cover"
        />

        <div className="flex flex-col justify-between w-[75%] h-full pl-4">
          <div className="flex flex-row justify-between">
            <div>
              <p className="text-[20px] font-semibold text-black">Product</p>
              <p className="text-[15px] text-[#666]">Category</p>
              <hr className="w-full mt-3" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a9a1e]">
                Stock Level: 26
              </p>
            </div>
          </div>

          <div className="flex flex-row items-end justify-between h-full">
            <div>
              <p className="text-[18px] font-bold text-left text-black">
                Price - Rs.600
              </p>
            </div>
            <div>
              <button className="w-[100px] h-[40px] bg-[#5d90f4] mx-auto rounded-[20px] text-[10px] font-bold text-center text-white">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
