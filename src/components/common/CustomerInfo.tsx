import { useState } from "react";

const CustomerInfo = () => {
  const [mobile, setMobile] = useState("");
  const [customer, setCustomer] = useState({ name: "", loyaltyPoints: 0 });
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    loyaltyPoints: 0,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulating customer lookup
    if (mobile === "1234567890") {
      setCustomer({ name: "John Doe", loyaltyPoints: 120 });
    } else {
      alert("Customer not found!");
    }
  };

  const handleNewCustomerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCustomer({ ...newCustomer, loyaltyPoints: 0 });
    setShowForm(false);
  };

  return (
    <div className=" w-full p-3 pb-0 mx-2 bg-white rounded-lg shadow-lg border">
      <h2 className="text-lg font-bold mb-2">Customer Info</h2>
      {!showForm ? (
        <>
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border py-1 px-3 rounded-2xl mb-2"
            />
            <button
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
            className="w-full border py-1 px-3 rounded-2xl mb-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
            className="w-full border py-1 px-3 rounded-2xl mb-2"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
            className="w-full border py-1 px-3 rounded-2xl mb-2"
          />
          <input
            type="date"
            placeholder="Birth Date"
            value={newCustomer.birthday}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, birthday: e.target.value })
            }
            className="w-full border py-1 px-3 rounded-2xl mb-2"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 font-semibold rounded-2xl"
          >
            Save Customer
          </button>
        </form>
      )}
    </div>
  );
}

export default CustomerInfo;
