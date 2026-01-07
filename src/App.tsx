import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { Sales } from "./pages/Sales";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import Report from "./pages/Report";
import Customers from "./pages/Customers";
import { Toaster } from "sonner";
import Expenses from "./pages/Expenses";
import Cheques from "./pages/Cheques";
import EmployeeLogin from "./pages/EmployeeLogin";
import Categories from "./pages/Categories";
import ForgotPassword from "./pages/ForgotPassword";
import Payment from "./pages/Payment";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryConfig } from "./config/queryConfig";

function App() {
  return (
    <QueryClientProvider client={queryConfig}>
      <Toaster richColors position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<EmployeeLogin />} />
          <Route path="/login" element={<EmployeeLogin />} />
          <Route path="sales" element={<Sales />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="home" element={<Dashboard />} />
          <Route path="reports" element={<Report />} />
          <Route path="cheques" element={<Cheques />} />
          <Route path="customers" element={<Customers />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="admin" element={<Login />} />
          <Route path="categories" element={<Categories />} />
          <Route path="forgetPIN" element={<ForgotPassword />} />
          <Route path="payment" element={<Payment />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;