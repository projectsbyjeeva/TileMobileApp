import React from "react";
import { FaHome, FaUsers, FaFileInvoice, FaChartBar, FaCog } from "react-icons/fa";

function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-20 bg-white shadow-lg items-center py-6 gap-6">

      <FaHome className="text-blue-500 text-xl cursor-pointer" />
      <FaUsers className="text-gray-500 text-xl cursor-pointer" />
      <FaFileInvoice className="text-gray-500 text-xl cursor-pointer" />
      <FaChartBar className="text-gray-500 text-xl cursor-pointer" />
      <FaCog className="text-gray-500 text-xl cursor-pointer" />

    </div>
  );
}

export default Sidebar;