import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/common/TopBar";
import SideBar from "../components/common/SideBar";
import Order from "../components/dashboard/Order";
import Total from "../components/dashboard/Total";
import AddCustomerInfo from "../components/dashboard/AddCustomerInfo";
import type {
  NewCustomer,
  ExistingCustomer,
} from "../interfaces/customerInterface.ts";
import type {
  Product,
  Cart,
  ProductDashboardResult,
  ProductVariant,
} from "../interfaces/productInterface.ts";
import type { Category } from "../interfaces/categoryInterface.ts";
import type { PaymentProps } from "../interfaces/saleInterface.ts";
import { useProducts, useProductSearch } from "../hooks/useProducts.ts";
import { useCategories } from "../hooks/useCategory.ts";
import { useProductVariantsbyProductId } from "../hooks/useProductVariant.ts";
import ProductVariantCard from "../components/product/ProductVariantCard.tsx";

type PaymentData = PaymentProps;

const Dashboard = () => {

  const mapProductToCart = (
  product: ProductDashboardResult,
  quantity: number = 1
): Cart => {
  return {
    productId: product.productId,
    productName: product.productName,
    sellingPrice: product.sellingPrice,
    image: product.image,
    quantity,
  };
};

const mapVariantToCart = (
  variant: ProductVariant,
  productName: string,
  image: string
): Cart => {
  return {
    productId: variant.productId.toString(),
    productName: `${productName} (${variant.color} / ${variant.size})`,
    sellingPrice: variant.sellingPrice,
    image,
    quantity: 1,
  };
};


  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
const [showVariantPopup, setShowVariantPopup] = useState(false);
  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryLoadError,
    error: err,
  } = useCategories();
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useProducts({ pageSize: 5 });
  const {
    data: productVariantsData, 
    isLoading: variantsLoading,
    isError: variantsError,
    error: variantsErr,
  } = useProductVariantsbyProductId(selectedProductId || "");

  const { data: searchResults, isLoading: isSearching } =
    useProductSearch(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(
    null as Category | null
  );
  const [showDetailedPopup, setShowDetailedPopup] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | any>(null);
  const [customer, setCustomer] = useState(
    null as NewCustomer | ExistingCustomer | null
  );
  const [cart, setCart] = useState([] as Cart[]);
  const navigate = useNavigate();
  const products = searchQuery ? searchResults : productsData;

  useEffect(() => {
    if (customer) setShowCustomerForm(false);
  }, [customer]);

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;

    const paymentData: PaymentData = {
      cart,
      customer,
      calculations,
      timestamp: Date.now(),
    };

    navigate("/payment", {
      state: paymentData,
    });

    // Option 3: Use Context/Redux (for global state management)
    // dispatch(setPaymentData(paymentData));
    // navigate("/payment");
  };

  const addToCart = (product: Cart) => {
    setCart((prevCart: Cart[]) => {
      const existingItem = prevCart.find(
        (item) => item.productId === product.productId
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newCartItem: Cart = {
          productId: product.productId,
          productName: product.productName,
          sellingPrice: product.sellingPrice,
          image: product.image,
          quantity: 1,
        };
        return [...prevCart, newCartItem];
      }
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== id));
  };

  const calculations = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.sellingPrice * item.quantity,
      0
    );

    const tax = 0;
    return { subtotal, tax };
  }, [cart, customer]);

  const filteredProducts = products?.filter((product) => {
    const matchesCategory =
      !selectedCategory ||
      product.categoryId ===
        categoryData?.find((c) => c.categoryId === selectedCategory.categoryId)
          ?.categoryName;
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // const outOfStockCount =
  //   products?.filter((p) => p.stockLevel === 0).length ?? 0;

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex flex-col w-full h-screen bg-gray-80 transition-all duration-300">
        <TopBar />
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-[75%] mt-1 ml-1">
            <div className="flex flex-row gap-2 my-3 ml-4">
              {categoryLoading ? <div>Loading categories...</div> : null}
              {categoryLoadError ? (
                <div>Error loading categories {err?.message}</div>
              ) : null}
              {categoryData?.map((cat) => (
                <button
                  key={cat.categoryId}
                  onClick={() =>
                    setSelectedCategory(
                      cat.categoryId === selectedCategory?.categoryId
                        ? null
                        : cat
                    )
                  }
                  className={`rounded-xl px-4 py-2 text-sm transition-colors ${
                    (cat.categoryId === selectedCategory?.categoryId &&
                      !selectedCategory) ||
                    selectedCategory?.categoryId === cat.categoryId
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-gray-500 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center ml-4 mt-3 w-[70%]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white w-full rounded-lg px-5 py-2 outline-none border"
                  placeholder="Search products..."
                />
                <i className="bx bx-search text-fontcolor pl-1"></i>
              </div>
              {/* {outOfStockCount > 0 && (
                <div className="mt-2 mx-3 text-red-500 text-sm font-semibold whitespace-nowrap">
                  {outOfStockCount} Items out of stock
                </div>
              )} */}
              <button
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              >
                Refresh Data
              </button>
            </div>

            <div className="flex flex-wrap gap-5 ml-4 mt-8">
              {isLoading && <div>Loading products...</div>}
              {isSearching && <div>Searching products...</div>}
              {isError && <div>Error: {error.message}</div>}

              {filteredProducts?.map((prod) => (
                <div
                  key={prod.productId}
                  className="flex w-[32%] p-1 pl-2  gap-2 border border-gray-300 rounded-xl items-center"
                >
                  <a
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setShowDetailedPopup(true);
                    }}
                  >
                    <img
                      src={new URL(prod.image, import.meta.url).href}
                      alt={prod.productName}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                  </a>
                  <div className="flex flex-col gap-1 w-full">
                    {" "}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col pr-1">
                        <div className="text-md text-fontcolor font-semibold">
                          {prod.productName}
                        </div>
                        <div className="text-sm text-fontcolor font-normal py-2">
                          {prod.productDescription}
                        </div>
                      </div>
                      {!prod.hasVariant && (
                        <div
                          className={`text-sm pr-1 font-semibold mt-1 flex-shrink-0 
                        ${
                          prod.stockLevel < 3
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                        >
                          Stock : {prod.stockLevel}
                        </div>
                      )}
                    </div>
                    <hr className="border-t border-gray-300" />
                    <div className="flex justify-between">
                      <div className="font-bold text-sm text-primary">
                        Rs {prod.sellingPrice}.00
                      </div>
                      {prod.hasVariant ? (
                        <button
                          onClick={() => {
                            setSelectedProductId(prod.productId);
                            setShowVariantPopup(true);
                          }}
                          className="rounded-xl bg-blue-200 text-primary font-semibold text-xs mt-2  px-3 py-2 hover:bg-blue-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Select Variant
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(mapProductToCart(prod))}
                          disabled={prod.stockLevel === 0}
                          className="rounded-xl bg-blue-200 text-primary font-semibold text-xs mt-2  px-3 py-2 hover:bg-blue-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                  {showDetailedPopup && selectedProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                        <button
                          onClick={() => setShowDetailedPopup(false)}
                          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
                        >
                          ×
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">
                          Product Details
                        </h2>
                        <img
                          src={
                            selectedProduct.image &&
                            typeof selectedProduct.image === "string" &&
                            selectedProduct.image.startsWith("http")
                              ? selectedProduct.image
                              : new URL(
                                  selectedProduct.image || prod.image,
                                  import.meta.url
                                ).href
                          }
                          className="h-64 w-full object-contain mb-4"
                          alt={selectedProduct.productName}
                        />
                        <p className="text-lg font-semibold mb-2">
                          {selectedProduct.productName}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {selectedProduct.productDescription}
                        </p>
                        <p className="text-xl text-blue-600 font-bold mb-4">
                          Rs{" "}
                          {selectedProduct.sellingPrice?.toFixed
                            ? selectedProduct.sellingPrice.toFixed(2)
                            : selectedProduct.sellingPrice}
                        </p>

                        
                      {variantsLoading ? <div>Loading variants...</div> : null}
                      {variantsError ? (
                        <div>Error loading categories {variantsErr?.message}</div>
                      ) : null}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {showVariantPopup && (
                <ProductVariantCard
                  variants={productVariantsData || []}
                  onClose={() => setShowVariantPopup(false)}
                  onAddToCart={(variant) => {
                    addToCart(
                      mapVariantToCart(
                        variant,
                        selectedProduct?.productName,
                        selectedProduct?.image
                      )
                    );
                    setShowVariantPopup(false);
                  }}
                />
              )}
            </div>
            {/* Pagination */}
            <div className="mt-6 flex gap-2 justify-center">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded"
              >
                Previous
              </button>
              <span className="px-4 py-2">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border rounded"
              >
                Next
              </button>
            </div>
          </div>

          <div className="w-[30%] h-[100%] bg-white flex flex-col gap-2 items-center border px-2 py-4 m-4 rounded-lg ">
            <button
              onClick={() => setShowCustomerForm(!showCustomerForm)}
              className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                customer
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {customer ? `Customer: ${customer.name}` : "Add Customer"}
            </button>
            <AddCustomerInfo
              showCustomerForm={showCustomerForm}
              onChangeDisplayForm={setShowCustomerForm}
              onSetCustomer={setCustomer}
            />
            <Order
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
            />

            <Total {...calculations} />

            <button
              disabled={cart.length === 0}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
              onClick={handleProceedToCheckout}
            >
              Checkout
              {cart.length > 0 && (
                <span className="ml-2 text-sm">
                  ({cart.length} item{cart.length > 1 ? "s" : ""})
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
