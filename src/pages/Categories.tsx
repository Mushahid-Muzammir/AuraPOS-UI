import { useState } from "react";
import TopBar from "../components/common/TopBar";
import SideBar from "../components/common/SideBar";
import categories from "../data/categories.json";
import { toast } from "sonner";

function Categories() {
  const [showAddForm, setShowAddForm] = useState(false);

  const onProductAdd = () => {
    toast.success("Product added successfully!");
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex flex-col w-full h-auto bg-gray-80 transition-all duration-300">
        <TopBar />
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-full mt-1 ml-1">
            <div className="flex flex-row justify-between items-center mt-3 mx-4 px-4 py-2">
              <div className="flex justify-between items-center ml-4 border w-[70%]">
                <input
                  type="text"
                  className="py-2 px-4 w-full bg-white outline-none"
                  placeholder="Search Category or Item"
                />
                <i className="bx bx-search text-fontcolor pr-1"></i>
              </div>
              <button
                className=" text-base px-6 py-3 bg-primary text-white font-semibold rounded-lg"
                onClick={() => setShowAddForm(true)}
              >
                Add Category
              </button>

              {showAddForm && (
                <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 z-50 ">
                  <div className="bg-white w-full max-w-xl h-[95%] pb-3 rounded-lg shadow-lg">
                    <div className="w-full flex flex-col bg-white p-8 rounded-lg">
                      <div className="flex flex-row justify-between">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">
                          Add New Product
                        </h2>
                        <button className="text-gray-400 hover:text-gray-700 text-2xl">
                          &times;
                        </button>
                      </div>
                      <form className="space-y-4">
                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Product Name
                          </label>
                          <input
                            type="text"
                            placeholder="🔖 Enter product name"
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Brand Name
                          </label>
                          <input
                            type="text"
                            placeholder="🏷️ Enter brand name"
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Stock Amount
                          </label>
                          <input
                            type="number"
                            placeholder="📦 Enter stock quantity"
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Select Category
                          </label>
                          <select className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none">
                            <option value="">📂 Select category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Minimum Price
                          </label>
                          <input
                            type="number"
                            placeholder="💰 Enter price"
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Reorder Level
                          </label>
                          <input
                            type="number"
                            placeholder="⚠️ Enter reorder level"
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div className="flex justify-between mt-6">
                          <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            onClick={() => onProductAdd()}
                          >
                            Add Product
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center"></div>
            <div className="flex flex-wrap m-4 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex p-4 h-24  w-[24%] border flex-row justify-between rounded-2xl bg-white"
                >
                  <div className="flex flex-col gap-3 justify-center">
                    <div className="text-lg font-semibold">{category.name}</div>
                    <div className="text-sm">
                      <span className="text-blue-500">{category.count}</span>{" "}
                      Items
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <button className="border-2 rounded-2xl px-2 text-sm border-primary">
                      Edit
                    </button>
                    <button className="border-2 rounded-2xl px-2 text-sm border-red-500">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;
