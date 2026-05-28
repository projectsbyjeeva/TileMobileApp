import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaHome,
  FaUsers,
  FaFileInvoice,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaClipboardList,
  FaChevronDown,
  FaChevronUp,
  FaUserShield
} from "react-icons/fa";

function DrawerMenu({ open, setOpen }) {
  const navigate = useNavigate();

  // ✅ MUST be inside component
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 transform transition duration-500 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full bg-gradient-to-b from-indigo-600 via-purple-600 to-blue-500 text-white shadow-2xl flex flex-col">

          {/* Header */}
          <div className="flex justify-between items-center p-5">
            <h2 className="text-lg font-semibold">Menu</h2>
            <FaTimes onClick={() => setOpen(false)} className="cursor-pointer" />
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center py-4 border-b border-white/20">
            <img
              src="https://i.pravatar.cc/80"
              className="w-16 h-16 rounded-full border-2 border-white"
              alt=""
            />
            <h3 className="mt-2 font-semibold">Jeeva M</h3>
            <p className="text-sm text-white/70">Admin</p>
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">

            <MenuItem icon={<FaHome />} label="Home" />
            <MenuItem icon={<FaUsers />} label="Customers" />
            <MenuItem icon={<FaClipboardList />} label="Quotation" onClick={() => navigate("/quotation")} />
            <MenuItem icon={<FaFileInvoice />} label="Billing" onClick={() => navigate("/billinglist")} />
             <MenuItem icon={<FaFileInvoice />} label="Stock" onClick={() => navigate("/billinglist")} />
            <MenuItem icon={<FaChartBar />} label="Reports" />
            <MenuItem icon={<FaCog />} label="Settings" />

            {/* 🔥 Admin Dropdown */}
            <div>
              <div
                onClick={() => setAdminOpen(!adminOpen)}
                className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer hover:bg-white/20"
              >
                <div className="flex items-center gap-4">
                  <FaUserShield />
                  <span>Admin</span>
                </div>
                {adminOpen ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {/* Submenu */}
              <div
                className={`ml-6 mt-2 space-y-2 overflow-hidden transition-all duration-300 ${
                  adminOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                <MenuItem
                  icon={<FaUsers />}
                  label="User Type"
                  onClick={() => navigate("/usertypelist")}
                />
                <MenuItem
                  icon={<FaUsers />}
                  label="User Creation"
                  onClick={() => navigate("/usercreate")}
                />
              </div>
            </div>

          </div>

          {/* Logout */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer">
              <FaSignOutAlt />
              <span>Logout</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// Menu Item Component
const MenuItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer hover:bg-white/20 transition"
  >
    <div>{icon}</div>
    <span>{label}</span>
  </div>
);

export default DrawerMenu;