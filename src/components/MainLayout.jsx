import React, { useState } from "react";
import DrawerMenu from "./DrawerMenu";
import BottomNav from "./BottomNav";
import { Menu, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Preferences  } from "@capacitor/preferences";


function MainLayout({ title, children }) {
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);


  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    const { value } = await Preferences.get({
      key:"user",
    });

       const user = JSON.parse(value);

    await API.post("/logout",{
      user_id:user.id
    }); // backend route


    await Preferences.remove({
      key:"token",
    });

      await Preferences.remove({
      key:"user",
    });


    navigate("/");
  } catch (err) {
    console.log(err);
      await Preferences.remove({
      key: "token",
    });

    await Preferences.remove({
      key: "user",
    });
   
     // still logout locally
    navigate("/");
  }
};


  return (
    <div className="h-screen relative overflow-hidden">

      {/* 🌈 COMMON BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-400"></div>

      {/* 🔥 Glow (same as dashboard) */}
      <div className="absolute top-[-100px] left-[-50px] w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-60px] w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col h-full">

        {/* Drawer */}
        <DrawerMenu open={open} setOpen={setOpen} />

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
          
          <Menu onClick={() => setOpen(true)} className="text-white cursor-pointer" />

          <h2 className="text-white font-semibold">{title}</h2>

          <div className="flex items-center gap-3">
            <Bell className="text-white" />
           <div className="relative">
  <img
    src="https://i.pravatar.cc/40"
    className="rounded-full border-2 border-white shadow cursor-pointer"
    alt=""
    onClick={() => setShowMenu(!showMenu)}
  />

  {showMenu && (
    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg text-black overflow-hidden">
      
      <div
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          setShowMenu(false);
          navigate("/profile");
        }}
      >
        Profile
      </div>

      <div
        className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </div>

    </div>
  )}
</div>
          </div>
        </div>

        {/* ✅ IMPORTANT: SCROLL AREA WITH PADDING */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
          {children}
        </div>

        {/* Bottom Nav */}
        <BottomNav />

      </div>
    </div>
  );
}

export default MainLayout;