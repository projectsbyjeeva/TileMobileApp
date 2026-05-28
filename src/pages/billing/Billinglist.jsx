import React, { useState } from "react";
import MainLayout from "../../components/MainLayout";
import { motion } from "framer-motion";
import { Plus, Search, Download, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function BillingList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [list, setList] = useState([
    {
      id: "INV001",
      customer: "Ravi",
      mobile: "9876543210",
      date: "12 Apr 2026",
      items: 3,
      total: 5200,
      status: "Paid"
    },
    {
      id: "INV002",
      customer: "Kumar",
      mobile: "9123456780",
      date: "10 Apr 2026",
      items: 2,
      total: 3100,
      status: "Pending"
    }
  ]);

  // 🔍 Filter Logic
  const filteredList = list.filter((item) => {
    const matchSearch =
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "All" || item.status === filter;

    return matchSearch && matchFilter;
  });

  // 🗑️ Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This bill will be deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete"
    }).then((result) => {
      if (result.isConfirmed) {
        setList(list.filter((i) => i.id !== id));
        Swal.fire("Deleted!", "Bill removed", "success");
      }
    });
  };

  return (
    <MainLayout title="Billing List">
      <div className="p-4 space-y-4 max-w-md mx-auto pb-24">

        {/* 🔍 SEARCH */}
        <div className="flex items-center bg-white/80 backdrop-blur shadow-lg rounded-xl px-3 py-2">
          <Search size={18} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice / customer..."
            className="ml-2 w-full outline-none text-sm bg-transparent"
          />
        </div>

        {/* 🎯 FILTER */}
        <div className="flex gap-2">
          {["All", "Paid", "Pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium shadow ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 📋 LIST */}
        {filteredList.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl border border-gray-100 space-y-2"
          >

            {/* TOP */}
            <div className="flex justify-between items-center">
              <div onClick={() => navigate(`/billing-view/${item.id}`)} className="cursor-pointer">
                <p className="font-semibold text-gray-800">{item.customer}</p>
                <p className="text-xs text-gray-500">{item.mobile}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.status === "Paid"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}>
                {item.status}
              </span>
            </div>

            {/* MIDDLE */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Invoice: {item.id}</span>
              <span>{item.date}</span>
            </div>

            {/* BOTTOM */}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-xs text-gray-500">
                {item.items} items
              </span>

              <div className="flex items-center gap-3">

                {/* 📄 VIEW */}
                <button
                  onClick={() => navigate(`/billing-view/${item.id}`)}
                  className="text-blue-600 text-xs"
                >
                  View
                </button>

                {/* 🧾 PDF */}
                <Download
                  size={18}
                  className="text-green-600 cursor-pointer"
                  onClick={() => alert("PDF Download Coming Soon")}
                />

                {/* 🗑️ DELETE */}
                <Trash2
                  size={18}
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(item.id)}
                />

                <span className="text-indigo-600 font-bold text-lg">
                  ₹{item.total}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* ➕ FLOATING BUTTON */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/billingform")}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-2xl"
        >
          <Plus />
        </motion.button>

      </div>
    </MainLayout>
  );
}

export default BillingList;