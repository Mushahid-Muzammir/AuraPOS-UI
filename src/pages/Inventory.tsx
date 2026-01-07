import { useState } from "react";
import TopBar from "../components/common/TopBar";
import SideBar from "../components/common/SideBar";
import { useCreateProduct } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategory";
import type { CreateProduct } from "../interfaces/productInterface";

const Inventory = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateProduct>>({
    productName: "",
    brandId: 0,
    categoryId: "",
    subCategoryId: "", 
    costPrice: 0,
    sellingPrice: 0,
    discountPrice: 0,
    currentStock: 0,
    image: "",
    description: "",
    barcode: "",
    isActive: true,
    isFeatured: false,
  });
  const createProductMutation = useCreateProduct();

  const {
    data: categoryData,
    isLoading: isCategoriesLoading,
    isError,
    error,
  } = useCategories();  

  const onProductAdd = async () => {
    if (
      !formData.productName ||
      !formData.sellingPrice ||
      formData.currentStock === undefined
    ) {
      return;
    }
    try {
      await createProductMutation.mutateAsync({
        productName: formData.productName,
        brandId: formData.brandId || 0,
        categoryId: formData.categoryId || "",
        subCategoryId: formData.subCategoryId || "",
        costPrice: formData.costPrice || 0,
        sellingPrice: formData.sellingPrice || 0,
        discountPrice: formData.discountPrice || 0,
        currentStock: formData.currentStock || 0,
        image: formData.image || "",
        description: formData.description || "",
        barcode: formData.barcode || "",
        isActive: formData.isActive ?? true,
        isFeatured: formData.isFeatured ?? false,
      } as CreateProduct);
      setShowAddForm(false);
      setFormData({
        productName: "",
        brandId: 0,
        categoryId: "",
        subCategoryId: "",
        costPrice: 0,
        sellingPrice: 0,
        discountPrice: 0,
        currentStock: 0,
        image: "",
        description: "",
        barcode: "",
        isActive: true,
        isFeatured: false,
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex flex-col w-full h-auto bg-gray-80 transition-all duration-300">
        <TopBar />
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-full mt-1 ml-1">
            <div className="flex flex-row justify-between items-center mt-3 mx-4 px-4 py-2">
              <button
                className="px-6 py-3 bg-primary text-white text-base font-semibold rounded-lg"
                onClick={() => setShowAddForm(true)}
              >
                Add Product
              </button>
              {showAddForm && (
                <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 z-50 ">
                  <div className="bg-white w-full max-w-xl h-[95%] pb-3 rounded-lg shadow-lg">
                    <div className="w-full flex flex-col bg-white p-8 rounded-lg">
                      <div className="flex flex-row justify-between">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">
                          Add New Product
                        </h2>
                        <button
                          onClick={() => setShowAddForm(false)}
                          className="text-gray-400 hover:text-gray-700 text-2xl"
                        >
                          &times;
                        </button>
                      </div>
                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          onProductAdd();
                        }}
                      >
                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            placeholder="🔖 Enter product name"
                            value={formData.productName || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                productName: e.target.value,
                              })
                            }
                            required
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Brand ID
                          </label>
                          <input
                            type="number"
                            placeholder="🏷️ Enter brand ID"
                            value={formData.brandId || 0}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                brandId: parseInt(e.target.value) || 0,
                              })
                            }
                            min="0"
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Cost Price
                          </label>
                          <input
                            type="number"
                            placeholder="💰 Enter cost price"
                            value={formData.costPrice || 0}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                costPrice: parseFloat(e.target.value) || 0,
                              })
                            }
                            min="0"
                            step="0.01"
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Description
                          </label>
                          <textarea
                            placeholder="📝 Enter product description"
                            value={formData.description || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Barcode
                          </label>
                          <input
                            type="text"
                            placeholder="📊 Enter barcode"
                            value={formData.barcode || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                barcode: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Image URL
                          </label>
                          <input
                            type="text"
                            placeholder="🖼️ Enter image URL"
                            value={formData.image || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                image: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Stock Amount *
                          </label>
                          <input
                            type="number"
                            placeholder="📦 Enter stock quantity"
                            value={formData.currentStock || 0}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                currentStock: parseInt(e.target.value) || 0,
                              })
                            }
                            required
                            min="0"
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Select Category
                          </label>
                          <select
                            value={formData.categoryId || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                categoryId: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          >
                            <option value="">📂 Select category</option>
                            {categoryData?.map((cat) => (
                              <option
                                key={cat.categoryId}
                                value={cat.categoryName}
                              >
                                {cat.categoryName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Selling Price *
                          </label>
                          <input
                            type="number"
                            placeholder="💰 Enter price"
                            value={formData.sellingPrice || 0}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                sellingPrice: parseFloat(e.target.value) || 0,
                              })
                            }
                            required
                            min="0"
                            step="0.01"
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-gray-700 font-medium block mb-1">
                            Discount Price
                          </label>
                          <input
                            type="number"
                            placeholder="💰 Enter discount price"
                            value={formData.discountPrice || 0}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                discountPrice: parseFloat(e.target.value) || 0,
                              })
                            }
                            min="0"
                            step="0.01"
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
                            type="submit"
                            disabled={createProductMutation.isPending}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {createProductMutation.isPending
                              ? "Adding..."
                              : "Add Product"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex justify-between items-center ml-4 mt-3 border w-[50%]">
                <input
                  type="text"
                  className="py-2 px-4 w-full bg-white outline-none"
                  placeholder="Search Category or Item"
                />
                <i className="bx bx-search text-fontcolor pr-1"></i>
              </div>
              <div className="text-red-500 mt-3 ml-3 text-sm font-semibold">
                8 Items out of stock
              </div>
            </div>
            <div className="flex flex-wrap m-4 gap-4">
              {isCategoriesLoading && <div>Loading categories...</div>}
              {isError && <div>Error: {error.message}</div>}

              {categoryData?.map((category) => (
                <div
                  key={category.categoryId}
                  className="flex p-4 h-24  w-[24%] border flex-row justify-between rounded-2xl bg-white"
                >
                  <div className="flex flex-col gap-3 justify-center">
                    <div className="text-lg font-semibold">
                      {category.categoryName}
                    </div>
                    <div className="text-sm">
                      <span className="text-blue-500">{category.productCount}</span>{" "}
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
};

export default Inventory;
