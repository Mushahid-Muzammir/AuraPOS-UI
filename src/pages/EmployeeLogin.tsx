import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import OtpInput from "react-otp-input";
import propic from "../assets/propic.jpeg";

const employeesList = [
  { id: 1, name: "Alice Johnson", role: "Front Desk Officer", pin: "123456" },
  { id: 2, name: "Bob Williams", role: "Administrator", pin: "654321" },
  { id: 3, name: "Charlie Brown", role: "Technician", pin: "112233" },
];

interface Employee {
  id: string | number;
  name: string;
  role?: string;
  pin?: string;
}

const EmployeeLogin = () => {
  const [pin, setPin] = useState("");
  const [employees] = useState<Employee[]>(employeesList);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(
    employees[0]
  );
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (pin.length < 6) {
      toast.error("Please enter a valid 6-digit PIN");
      return;
    }
    toast.success("Login successful! 🎉");
    navigate("/home");
  };

  const handleForgotPin = () => {
    navigate("/forgetPIN");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="Company Logo"
          className="w-40 h-40 object-contain"
        />
      </div>

      <h1 className="text-4xl font-semibold mb-8">Employee Login</h1>
      <div className="mb-2">
        <p className="text-gray-500 text-lg">
          Choose your account from the list.
        </p>
      </div>

      <div className="flex items-center bg-white mb-12">
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
      <p className="text-gray-500 text-lg mb-2">
        Enter your secret PIN to validate yourself.
      </p>
      <div className="flex gap-2 mb-3">
        <OtpInput
          value={pin}
          onChange={setPin}
          numInputs={8}
          inputType="password"
          renderInput={(props) => <input {...props} />}
          renderSeparator={() => <span>&nbsp;&nbsp;&nbsp;</span>}
          inputStyle={{
            width: "3rem",
            height: "3rem",
            fontSize: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            textAlign: "center",
          }}
        />
      </div>

      <button
        onClick={handleForgotPin}
        className="text-end text-blue-500 text-sm mb-6"
      >
        Forgot PIN?
      </button>

      <button
        type="submit"
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-600 text-white w-72 py-3 rounded-lg font-medium"
      >
        Login
      </button>
    </div>
  );
};

export default EmployeeLogin;
