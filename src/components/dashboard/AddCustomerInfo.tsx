import React, { useState } from "react";
import type {
  NewCustomer,
  ExistingCustomer,
} from "../../datatypes/customerTypes.ts";
import type { AddCustomerInfoProps } from "../../datatypes/propTypes.ts";

const AddCustomerInfo = ({
  showCustomerForm,
  onChangeDisplayForm,
  onSetCustomer,
}: AddCustomerInfoProps) => {
  const [phone, setPhone] = useState("");
  const [customer] = useState({
    name: "",
    phone: "",
    loyaltyPoints: 0,
  } as ExistingCustomer);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthday: "",
  } as NewCustomer);

  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    birthday: "",
  } as NewCustomer);

  const handleSubmit = () => {
    if (formData.name && formData.phone) {
      onSetCustomer(formData);
      onChangeDisplayForm(false);
      setFormData({ name: "", phone: "", birthday: "" });
    }
  };

  const handleNewCustomerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTimeout(() => {
      setNewCustomer({ ...newCustomer, loyaltyPoints: 0 });
    }, 2000);
    toggleShowValue(false);
  };

  const toggleShowValue = (value: boolean) => {
    onChangeDisplayForm(value); // Toggle the value
  };

  if (!showCustomerForm) return null;

  return (
    <div className=" w-full p-3 pb-0 mx-2 bg-white rounded-lg shadow-lg border">
      <h2 className="text-lg font-bold mb-2">Customer Info</h2>
      {!showForm ? (
        <>
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border py-2 px-3 mb-2"
            />

            <button
              onClick={() => {
                showCustomerForm = false;
              }}
              type="submit"
              className="w-full bg-blue-200 text-primary font-semibold p-2 rounded-2xl"
            >
              Submit
            </button>
          </form>
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-green-200 text-green-500 font-semibold p-2 rounded-2xl mb-2"
          >
            Add New Customer
          </button>

          {customer && (
            <div className="mt-2 p-3 bg-gray-100 rounded-xl mb-2">
              <h3 className="font-semibold">{customer.name}</h3>
              <p className="text-sm">
                Loyalty Points: <strong>{customer.loyaltyPoints}</strong>
              </p>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleNewCustomerSubmit} className="mb-3">
          <input
            type="text"
            placeholder="Name"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            className="w-full border py-2 px-3 mb-2"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
            className="w-full border py-2 px-3 mb-2"
          />
          <input
            type="date"
            placeholder="Birth Date"
            value={newCustomer.birthday.toString().split("T")[0]}
            className="w-full border py-2 px-3 mb-2"
          />
          <button
            onClick={() => {
              toggleShowValue(false);
            }}
            type="submit"
            className="w-full bg-primary text-white p-2 font-semibold rounded-2xl"
          >
            Save Customer
          </button>
        </form>
      )}
    </div>
  );
};

export default AddCustomerInfo;
