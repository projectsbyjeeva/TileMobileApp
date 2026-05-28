import React from "react";
import { FaHome, FaUsers, FaChartBar, FaCog, FaPlus } from "react-icons/fa";

function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around items-center py-3 z-50">

      <FaHome className="text-blue-500 text-xl" />
      <FaUsers className="text-gray-500 text-xl" />

      {/* Floating Button */}
      <div className="bg-blue-500 p-4 rounded-full text-white -mt-10 shadow-xl border-4 border-white">
        <FaPlus />
      </div>

      <FaChartBar className="text-gray-500 text-xl" />
      <FaCog className="text-gray-500 text-xl" />

    </div>
  );
}

export default BottomNav;