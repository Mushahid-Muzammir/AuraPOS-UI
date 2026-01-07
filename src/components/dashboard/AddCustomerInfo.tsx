import React, { useState } from "react";
import type {
  NewCustomer,
  ExistingCustomer,
} from "../../interfaces/customerInterface";
import type { AddCustomerInfoProps } from "../../interfaces/customerInterface";
import { useCustomerSearch, useCreateCustomer } from "../../hooks/useCustomers";
import { toast } from "sonner";

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

  const { data: searchResults, isLoading: isSearching } = useCustomerSearch(phone);
  const createCustomerMutation = useCreateCustomer();

  if (!showCustomerForm) return null;

  const handleSearchCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 1) {
      toast.error("Please enter a phone number");
      return;
    }

    if (searchResults && searchResults.length > 0) {
      const foundCustomer = searchResults[0];
      const existingCustomer: ExistingCustomer = {
        name: foundCustomer.customerName,
        phone: foundCustomer.customerPhone,
        loyaltyPoints: foundCustomer.loyaltyPoints || 0,
      };
      onSetCustomer(existingCustomer);
      onChangeDisplayForm(false);
      setPhone("");
    } else {
      toast.info("Customer not found. You can add them as a new customer.");
    }
  };

  const handleAddNewCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const createdCustomer = await createCustomerMutation.mutateAsync(newCustomer);
      const newCust: NewCustomer = {
        name: createdCustomer.customerName,
        phone: createdCustomer.customerPhone,
        birthday: createdCustomer.birthDate || "",
        loyaltyPoints: createdCustomer.loyaltyPoints || 0,
      };
      onSetCustomer(newCust);
      onChangeDisplayForm(false);
      setNewCustomer({ name: "", phone: "", birthday: "" });
    } catch (error) {
      // Error handling is done in the mutation
    }
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
