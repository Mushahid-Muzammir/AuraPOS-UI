import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import menuLogo from "../../assets/menu.svg";
import PropTypes from "prop-types";

const SideBarContext = createContext({ expanded: false });

const SideBar = ({ children }: { children?: ReactNode }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`flex flex-col top-0 bg-white h-screen transition-all duration-300 fixed relative ${
        expanded ? "w-[120px]" : "w-[70px]"
      }`}
    >
      <div className="flex justify-end px-3 py-4">
        <button
          onClick={() => setExpanded((curr) => !curr)}
          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
        >
          <img src={menuLogo} alt="menu" className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <SideBarContext.Provider value={{ expanded }}>
        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-2 px-2">
            {children}
            <SideBarItem
              icon="bx bxs-dashboard"
              label="Dashboard"
              path="/home"
            />
            <SideBarItem icon="bx bx-cart" label="Payment" path="/payment" />
            <SideBarItem
              icon="bx bx-bar-chart-alt"
              label="Sales"
              path="/sales"
            />
            <SideBarItem
              icon="bx bxs-shopping-bags"
              label="Inventory"
              path="/inventory"
            />
            <SideBarItem
              icon="bx bxs-user"
              label="Customers"
              path="/customers"
            />
            <SideBarItem
              icon="bx bx-line-chart"
              label="Reports"
              path="/reports"
            />
            <SideBarItem
              icon="bx bx-dollar-circle"
              label="Expenses"
              path="/expenses"
            />
            <SideBarItem
              icon="bx bx-check-double"
              label="Cheques"
              path="/cheques"
            />
            <SideBarItem
              icon="bx bx-list-check"
              label="Categories"
              path="/categories"
            />
            <SideBarItem icon="bx bx-cog" label="Settings" path="/settings" />
          </ul>
        </nav>
      </SideBarContext.Provider>
    </aside>
  );
}

export default SideBar;

export interface SideBarItemProps {
  icon: string;
  label?: string;
  path: string;
}

export function SideBarItem({ icon, label, path }: SideBarItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { expanded } = useContext(SideBarContext);

  const isActive = location.pathname === path;

  return (
    <li
      onClick={() => navigate(path)}
      className={`flex flex-col items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${
        isActive ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-600"
      }`}
    >
      {/* Icon always visible */}
      <i className={`${icon} text-lg`} />
      {/* Label hidden when collapsed */}
      {expanded && <span className="text-sm font-medium">{label}</span>}
    </li>
  );
}

SideBarItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string,
  path: PropTypes.string.isRequired,
};
