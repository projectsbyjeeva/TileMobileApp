import React, { useEffect ,useState} from "react";
import MainLayout from "../components/MainLayout";
import { motion } from "framer-motion";


import API  from "../api/axios";

import {
  IndianRupee,
  Plus,
  Users,
  FileText,
  TrendingUp,
  Bell
} from "lucide-react";

function Dashboard() {


  const[msg, setMsg] = useState("");


useEffect(() => {
const token = localStorage.getItem("token");
  // alert(token);
    API.get("/test")
      .then((res) => {
        setMsg(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);



  const data = {
    today_sales: 4500,
    month_sales: 28740,
    total_sales: 124300,
    customers: 52,
    invoices: 120,
    paid: 95,
    pending: 25
  };

  return (
    <MainLayout title="Dashboard">



      {/* 👋 Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-white">Hi, Jeeva 👋</h2>
        <p className="text-white/70 text-sm">Welcome back</p>
      </motion.div>

      {/* 🔥 SALES OVERVIEW */}
      <div className="grid grid-cols-2 gap-4 mt-4">

        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl text-white shadow-xl"
        >
          <p className="text-sm opacity-70">Today</p>
          <h2 className="text-xl font-bold flex items-center gap-1">
            <IndianRupee size={18}/> {data.today_sales}
          </h2>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl text-white shadow-xl"
        >
          <p className="text-sm opacity-70">This Month</p>
          <h2 className="text-xl font-bold flex items-center gap-1">
            <IndianRupee size={18}/> {data.month_sales}
          </h2>
        </motion.div>

      </div>

       <div>
      <h2>Dashboard</h2>
      <p>{msg}</p>
    </div>

      {/* 🔥 TOTAL SALES */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-r from-green-400 to-emerald-500 p-5 rounded-3xl shadow-2xl text-white mt-4"
      >
        <p className="text-sm opacity-80">Total Sales</p>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <IndianRupee /> {data.total_sales}
        </h1>
      </motion.div>

      {/* 🔥 BUSINESS STATS */}
      <div className="grid grid-cols-2 gap-4 mt-4">

        <motion.div className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
          <div className="bg-green-100 p-3 rounded-xl">
            <Users className="text-green-600" />
          </div>
          <div>
            <h3 className="font-bold">{data.customers}</h3>
            <p className="text-sm text-gray-500">Customers</p>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-xl">
            <FileText className="text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold">{data.invoices}</h3>
            <p className="text-sm text-gray-500">Invoices</p>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <TrendingUp className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold">{data.paid}</h3>
            <p className="text-sm text-gray-500">Paid</p>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
          <div className="bg-red-100 p-3 rounded-xl">
            <Bell className="text-red-600" />
          </div>
          <div>
            <h3 className="font-bold">{data.pending}</h3>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </motion.div>

      </div>

      {/* 🔥 ACTION CARD */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-green-400 to-emerald-500 p-5 rounded-3xl shadow-xl text-white flex justify-between items-center mt-4"
      >
        <div>
          <h3 className="text-lg font-semibold">Create Bill</h3>
          <p className="text-sm opacity-80">Fast billing</p>
        </div>
        <Plus />
      </motion.div>

      {/* 📊 CHART PLACEHOLDER */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-3xl mt-4">
        <div className="flex items-center gap-2 mb-3 text-white">
          <TrendingUp />
          <span>Sales</span>
        </div>
        <div className="h-24 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-xl"></div>
      </div>

      {/* 🧾 RECENT */}
      <div className="bg-white rounded-3xl p-4 shadow-xl mt-4">
        <h3 className="font-semibold mb-3 text-gray-700">Recent Bills</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Aarav Tiles</span>
            <span className="text-green-600">₹4500</span>
          </div>
          <div className="flex justify-between">
            <span>Mehta Ceramics</span>
            <span className="text-red-500">₹3850</span>
          </div>
        </div>
      </div>

    </MainLayout>
  );
}

export default Dashboard;