import { useState } from "react";

export const LowStockNotification = () => {
  const handleDismiss = (id: number) => {
    console.log(`Dismiss notification for item with id: ${id}`);
  };

  const [isOpen, setIsOpen] = useState(false);

  const lowStockItems = [
    { id: 1, name: "iPhone 13", quantity: 2 },
    { id: 2, name: "Samsung Charger", quantity: 1 },
    { id: 3, name: "AirPods Pro", quantity: 3 },
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-gray-900"
      >
        {lowStockItems.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {lowStockItems.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2 font-semibold border-b border-gray-200">
            Low Stock Alerts
          </div>
          {lowStockItems.length > 0 ? (
            lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-2 hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-red-500">
                    Only {item.quantity} left in stock
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(item.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  ✖
                </button>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">
              No low stock items 🎉
            </div>
          )}
        </div>
      )}
    </div>
  );
};
