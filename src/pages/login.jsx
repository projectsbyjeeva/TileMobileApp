import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Swal from "sweetalert2";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Preferences } from "@capacitor/preferences";



function Login() {
  const [name, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [LoadingItem, setLoadingItem] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!name) newErrors.name = "Username is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoadingItem(true);

    try {
      const res = await API.post("/login", { name, password });
      const api = res.data;

      if (api.token) {
          await Preferences.set({
    key: "token",
    value: api.token,
  });

  



  await Preferences.set({
    key: "user",
    value: JSON.stringify(api.user),
  });

  const { value } = await Preferences.get({
    key:"token",
  });
   console.log("Stored Token:" ,value);

     Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Login Successful",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard");
      }

    

    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        Swal.fire("Error", "Invalid Username or Password", "error");
      } else if (status === 422) {
        Swal.fire("Error", "Validation failed", "error");
      } else if (status === 500) {
        Swal.fire("Error", "Server error, try again later", "error");
      } else {
        Swal.fire("Error", err.message || "Network error", "error");
      }

    } finally {
      setLoadingItem(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ececff] flex items-center justify-center p-4 overflow-hidden relative">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6d4df2] via-[#8d38f5] to-[#b35ca1]" />

      {/* Blur circles */}
      <div className="absolute top-[-120px] right-[-100px] w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] left-[-100px] w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-white/12 backdrop-blur-2xl border border-white/20 rounded-[35px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

          {/* Header */}
          <div className="px-6 pt-8 pb-6">
            <div className="mt-8 bg-gradient-to-r from-[#5c43e6] to-[#ff4fa3] rounded-[28px] p-5 shadow-xl">
              <h2 className="text-white text-2xl font-bold leading-tight">
                Welcome Back 👋
              </h2>
              <p className="text-white/70 text-sm mt-2">
                Login Here
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-t-[38px] px-6 pt-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Username */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Username
                </label>
                <div className="h-14 rounded-2xl bg-[#f5f7ff] border border-[#e2e8f0] flex items-center px-4 focus-within:border-[#7c4dff] transition-all">
                  <User size={18} className="text-[#7c4dff] mr-3" />
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={name}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-2">{errors.name}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Password
                </label>
                <div className="h-14 rounded-2xl bg-[#f5f7ff] border border-[#e2e8f0] flex items-center px-4 focus-within:border-[#ff4fa3] transition-all">
                  <Lock size={18} className="text-[#ff4fa3] mr-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2">{errors.password}</p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#6d4df2] to-[#ff4fa3] text-white font-bold text-base shadow-xl active:scale-[0.98] transition-all"
              >
                {LoadingItem ? "Please wait..." : "Login"}
              </button>

              {/* Footer */}
              <div className="text-center pt-2">
                <p className="text-sm text-gray-500">
                  Tile & Quotation Management
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Loader */}
      {LoadingItem && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl px-8 py-7 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#7c4dff] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 text-sm font-medium">Logging In...</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default Login;
