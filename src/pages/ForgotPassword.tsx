import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { toast } from "sonner";
import propic from "../assets/propic.jpeg";

interface Employee {
  id: string | number;
  name: string;
  role?: string;
  pin?: string;
}

const ForgotPassword = () => {
  const employeesList = [
    { id: 1, name: "Alice Johnson", role: "Front Desk Officer", pin: "123456" },
    { id: 2, name: "Bob Williams", role: "Administrator", pin: "654321" },
    { id: 3, name: "Charlie Brown", role: "Technician", pin: "112233" },
  ];

  const [email, setEmail] = useState("");
  const [employees] = useState<Employee[]>(employeesList);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(
    employees[0]
  );
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const RequestPIN = () => {
    if (email === "") {
      toast.error("Please enter a valid email");
      return;
    }
    toast.info(
      `You will have received a new PIN to your email if your account exists!`,
      { duration: 3000 }
    );
  };

  return (
    <div className="flex flex-col gap-2 items-center min-h-screen bg-white p-4">
      <div className="flex gap-2">
        <img
          src={logo}
          alt="Company Logo"
          className="w-40 h-40 object-contain"
        />
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-semibold my-2">Forgot Password</h2>
        <div className="mt-2 mb-8">
          <p className="text-gray-500 text-lg">
            Choose your account from the list and enter your registered email.
          </p>
        </div>

        <div className="flex items-center bg-white mb-3">
          <div className="relative w-80">
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center w-full p-3 border rounded-lg shadow-sm bg-white cursor-pointer"
            >
              <img
                src={propic}
                alt={selectedEmployee.name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{selectedEmployee.name}</p>
              </div>
              <span className="text-gray-400">&#9662;</span>
            </div>

            {open && (
              <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setOpen(false);
                    }}
                    className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={propic}
                      alt={emp.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <p className="font-medium">{emp.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className=" w-[30%] border rounded-lg px-6 py-3"
        placeholder="Enter your email"
      />

      <div className="flex flex-col gap-2 mt-6">
        <button
          onClick={RequestPIN}
          className="bg-blue-500 hover:bg-blue-600 text-white w-72 py-3 rounded-lg font-medium"
        >
          Request PIN
        </button>

        <button
          onClick={() => navigate("/")}
          className="text-black w-72 py-3 font-medium text-base"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
