import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import OtpInput from "react-otp-input";
import propic from "../assets/propic.jpeg";
import {  useEmployeeLogin, useEmployeesForLogin } from "../hooks/useEmployees";
import type { EmployeeLoginList } from "../interfaces/employeeInterface";

const EmployeeLogin = () => {
  const [pin, setPin] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeLoginList | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployeesForLogin();
  const employees = employeesData?.data || [];
  const employeeLogin = useEmployeeLogin();

  const handleLogin = () => {
  if (pin.length < 8 || !selectedEmployee) return;

  employeeLogin.mutate({
    username: selectedEmployee.email,
    password: pin,
  });
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
          {isLoadingEmployees ? (
            <div className="p-3 text-center">Loading employees...</div>
          ) : (
            <>
              <div
                onClick={() => setOpen(!open)}
                className="flex items-center w-full p-3 border rounded-lg shadow-sm bg-white cursor-pointer"
              >
                <img
                  src={propic}
                  alt={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : "Select Employee"}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">
                    {selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : "Select Employee"}
                  </p>
                </div>
                <span className="text-gray-400">&#9662;</span>
              </div>

              {open && (
                <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {employees.map((emp ) => (
                    <div
                      key={emp.employeeId}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setOpen(false);
                      }}
                      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={propic}
                        alt={emp.firstName + " " + emp.lastName}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                        {emp.email && <p className="text-sm text-gray-500">{emp.email}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
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
        disabled={!selectedEmployee || pin.length < 8 || employeeLogin.isPending}
        className="bg-blue-500 hover:bg-blue-600 text-white w-72 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {employeeLogin.isPending ? "Please wait..." : "Login"}
      </button>
    </div>
  );
};

export default EmployeeLogin;
