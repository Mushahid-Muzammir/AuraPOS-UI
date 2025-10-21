import { useState } from "react";
import logo from "../../assets/logo.png";
import profilePic from "../../assets/propic.jpeg";
import back from "../../assets/back.svg";
import notificationLogo from "../../assets/notification.svg";
import alertIcon from "../../assets/alert.svg";
import reminderLogo from "../../assets/reminder.svg";

const TopBar = () => {
  const notifications = [
    {
      id: 1,
      description: "Low Stock Alert",
      name: "iPhone 13",
      qty: 2,
      date: "",
      type: "Low_Stock",
    },
    {
      id: 2,
      description: "Low Stock Alert",
      name: "Samsung Charger",
      qty: 1,
      date: "",
      type: "Low_Stock",
    },
    {
      id: 3,
      description: "Cheque Date Reminder",
      name: "Mr. Asanka",
      qty: 3,
      date: "18 August",
      type: "Cheque_Rem",
    },
    {
      id: 4,
      description: "Low Stock Alert",
      name: "AirPods Pro",
      qty: 3,
      date: "",
      type: "Low_Stock",
    },
    {
      id: 5,
      description: "Cheque Date Reminder",
      name: "Mr. Rahul",
      qty: 3,
      date: "17 August",
      type: "Cheque_Rem",
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border-b-3 border-gray-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-3 justify-start p-1">
          <button className="rounded-full border border-grey m-3 mx-5 p-1">
            <img src={back} alt="" className="h-6 w-8 text-fontcolor" />
          </button>
          <div className="h-11 w-2 mt-2 border-l-2 border-gray-200 mx-auto"></div>
          <div className="">
            <img src={logo} alt="logo" className="h-16 w-16 mt-2 mx-4 " />
          </div>
        </div>
        <div className="flex flex-row gap-8 justify-end">
          <div className="relative justify-center items-center flex m-3 mt-2 ml-1">
            <button
              className="relative p-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsOpen(!isOpen)}
            >
              <img
                src={notificationLogo}
                alt="Notification Sign"
                className="w-8 h-7 mt-3 flex"
              />
              {notifications.length > 0 && (
                <span className="absolute top-3 right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/30  z-40"
              onClick={() => setIsOpen(false)}
            />
          )}

          {isOpen && (
            <div className="absolute right-32 top-16 bg-white shadow-lg rounded-lg w-[30%] z-50">
              <div className="flex justify-between py-3 mx-4 border-b">
                <p className="font-semibold text-lg">Notifications</p>
                <a
                  href="/inventory"
                  className="text-sm text-blue-500 font-medium hover:underline flex items-center gap-1"
                >
                  Mark all as read
                </a>
              </div>
              <div className="max-h-90 overflow-y-auto">
                {notifications.map((alert) => (
                  <a
                    key={alert.id}
                    className="px-4 py-3 flex justify-between items-center border-b hover:bg-gray-50"
                    href={`/inventory/${alert.id}`}
                  >
                    <div>
                      <div className="flex gap-2">
                        {alert.type === "Low_Stock" && (
                          <img
                            src={alertIcon}
                            className="bg-grey-500 rounded-full w-5 h-6"
                          />
                        )}
                        {alert.type === "Cheque_Rem" && (
                          <img
                            src={reminderLogo}
                            className="bg-grey-500 rounded-full w-5 h-6"
                          />
                        )}
                        <p className="font-medium text-medium">
                          {alert.description}
                          <span className="text-sm text-red-500">
                            {" "}
                            - {alert.name}{" "}
                          </span>
                          {alert.type === "Low_Stock" && (
                            <span className="text-sm text-red-500">
                              {" "}
                              ( {alert.qty} left ){" "}
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="text-sm text-gray-400">15 mins ago</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex rounded-xl text-fontcolor bg-bgcolor justify-center items-center m-5 p-2 px-3 gap-3">
            <div className="">10:53:00</div>
            <div className="">26/02/2023</div>
          </div>
          <div className="justify-center items-center flex m-3 mt-2 ml-1">
            <img
              src={profilePic}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
