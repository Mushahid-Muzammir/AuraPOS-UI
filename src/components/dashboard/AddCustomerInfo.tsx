import React, { useState } from "react";
import type {
  NewCustomer,
  ExistingCustomer,
} from "../../datatypes/customerTypes";
import type { AddCustomerInfoProps } from "../../datatypes/propTypes";

const AddCustomerInfo = ({
  showCustomerForm,
  onChangeDisplayForm,
  onSetCustomer,
}: AddCustomerInfoProps) => {
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
  const [phone, setPhone] = useState("");

  const [newCustomer, setNewCustomer] = useState<NewCustomer>({
    name: "",
    phone: "",
    birthday: "",
  });

  if (!showCustomerForm) return null;

  // Simulate fetching existing customer by phone number
  const handleSearchCustomer = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock example: imagine calling an API here
    const foundCustomer: ExistingCustomer = {
      name: "John Doe",
      phone,
      loyaltyPoints: 120,
    };

    // Set customer to parent state and close form
    onSetCustomer(foundCustomer);
    onChangeDisplayForm(false);
    setPhone("");
  };

  const handleAddNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCustomer.name || !newCustomer.phone) return;

    const newCust: NewCustomer = {
      ...newCustomer,
      loyaltyPoints: 0,
    };

    onSetCustomer(newCust);
    onChangeDisplayForm(false);
    setNewCustomer({ name: "", phone: "", birthday: "" });
  };

  return (
    <div className="w-full p-4 mx-2 bg-white rounded-lg shadow-lg border">
      <h2 className="text-lg font-bold mb-3">Customer Info</h2>

      {!isAddingNewCustomer ? (
        <>
          <form onSubmit={handleSearchCustomer} className="mb-4">
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border py-2 px-3 mb-2 rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-lg transition"
            >
              Set Customer
            </button>
          </form>

          <button
            onClick={() => setIsAddingNewCustomer(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold p-2 rounded-lg transition"
          >
            Add New Customer
          </button>
        </>
      ) : (
        <form onSubmit={handleAddNewCustomer} className="mb-3">
          <input
            type="text"
            placeholder="Name"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            className="w-full border py-2 px-3 mb-2 rounded-lg"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
            className="w-full border py-2 px-3 mb-2 rounded-lg"
          />

          <input
            type="date"
            placeholder="Birth Date"
            value={newCustomer.birthday}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, birthday: e.target.value })
            }
            className="w-full border py-2 px-3 mb-3 rounded-lg"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-2 rounded-lg transition"
            >
              Save Customer
            </button>
            <button
              type="button"
              onClick={() => setIsAddingNewCustomer(false)}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold p-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddCustomerInfo;
