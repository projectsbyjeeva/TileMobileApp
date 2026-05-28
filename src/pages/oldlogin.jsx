// import React, { useState } from 'react';
// import { Navigate, useNavigate } from 'react-router-dom';
// import API from "../api/axios";
// import Swal from "sweetalert2";

// function Login() {
//   const [name, setUserName] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors]  = useState({});
//   const [LoadingItem, setLoadingItem] = useState(false);
  

//   const navigate = useNavigate();

// const handleLogin  = (e) => {
// e.preventDefault();

//   let newErrors = {};
  
// if(!name) newErrors.name = "User Name is Required";
// if(!password) newErrors.password = "Password is Required";

// if(Object.keys(newErrors).length > 0){
//   setErrors(newErrors);
//   return;
// }

// setErrors({});
// setLoadingItem(true);

// API.post(`/login`,{
//   name:name,
//   password:password
// }).then((res) => {
//         const api = res.data;


//         if ((api.status === false) &&(api.message === "Invalid Credentials")) {
//    Swal.fire({
//   title: "❌ Login Failed",
//   html: "<b>Invalid Username or Password</b><br/>Try again.",
//   icon: "warning",

//   background: "linear-gradient(135deg, #667eea, #764ba2)",
//   color: "#fff",

//   confirmButtonText: "Retry 🔄",
//   confirmButtonColor: "#00c853",

//   backdrop: `
//     rgba(0,0,0,0.6)
//   `
// });
// return;
//         }

//           if (api.token) {
//     localStorage.setItem("token", api.token); 
//      localStorage.setItem("user", JSON.stringify(api.user));
//   }
//         Swal.fire("Success", "Login successful", "success");
//         navigate("/dashboard");
//       })
//       .catch((err) => {
//   if (err.response) {
//     // alert('test');
//     const status = err.response.status;
//     // alert(status);

//     if (status == 401) {
//       Swal.fire("Error", "Invalid Credentials", "error");
//     } 
//     else if (status === 422) {
//       Swal.fire("Error", "Validation failed", "error");
//     } 
//     else if (status === 500) {
//       Swal.fire("Error", "Server error, try again later", "error");
//     } 
//     else {
//       Swal.fire("Error", "Something went wrong", "error");
//     }

//   } else {
//     Swal.fire("Error", "Network error", "error");
//   }
// })
//       .finally(() => {
//         setLoadingItem(false);
//       });
//   };




//   return (
// <div
//   className="min-h-screen flex items-center justify-center"
//   style={{
//     backgroundImage:
//       "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     // border: "5px solid red", // debug
//   }}
// >
//       {/* Overlay (dark tint) */}
//       <div className="absolute inset-0 bg-black/40"></div>

//       {/* Glass Card */}
//       <div className="relative backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-[90%] max-w-md text-white">

//         <h2 className="text-3xl font-bold mb-2">Login</h2>
//         <p className="text-sm text-gray-200 mb-6">
//           Welcome back! Please login to your account
//         </p>

//         <form className="space-y-5">

//           {/* Email */}
//           <div>
//             <input
//               type="name"
//               placeholder="Enter UserName"
//               className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
//               value={name}
//               onChange={(e) =>  setUserName(e.target.value)}
//             />

//                {errors.name && (
//               <p className="text-red-400 text-sm mt-1">
//                 {errors.name}
//               </p>
//             )}
//           </div>

//           {/* Password */}
//          {/* Password */}
// <div className="relative">
//   <input
//     type={showPassword ? "text" : "password"}
//     placeholder="Password"
//     className="w-full px-4 py-3 pr-12 rounded-lg bg-white/20 border border-white/30 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
//     value={password}
//     onChange={(e) => setPassword(e.target.value)}
//   />

//   <button
//     type="button"
//     onClick={() => setShowPassword(!showPassword)}
//     className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
//   >
//     {showPassword ? "🙈" : "👁"}
//   </button>

//   {errors.password && (
//     <p className="text-red-400 text-sm mt-1">
//       {errors.password}
//     </p>
//   )}
// </div>



//         {(LoadingItem) && (
//   <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

//     <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-4">

//       {/* Apple Spinner */}
//       <div className="relative w-12 h-12">
//         {[...Array(12)].map((_, i) => (
//           <span
//             key={i}
//             className="absolute w-1.5 h-4 bg-blue-500 rounded-full opacity-0 animate-[fade_1.2s_linear_infinite]"
//             style={{
//               transform: `rotate(${i * 30}deg) translateY(-18px)`,
//               animationDelay: `${i * 0.1}s`
//             }}
//           />
//         ))}
//       </div>

//       {/* Text */}
//       <p className="text-sm text-gray-600 font-medium">
//         {"Logging In..."}
//       </p>

//     </div>

//   </div>
// )}

//           {/* Remember Me */}
//           <div className="flex items-center gap-2 text-sm text-gray-200">
//             <input type="checkbox" className="accent-green-400" />
//             Remember me
//           </div>

//           {/* Button */}
//           <button
//            onClick={handleLogin}
//             className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-green-400 to-lime-500 text-black hover:scale-105 transition"
//           >
//             Login
//           </button>

// {/*         
//           <p className="text-center text-sm text-gray-200">
//             Don’t have an account?{" "}
//             <span className="text-green-300 cursor-pointer" onClick={(e) => {
//               e.preventDefault();
//               navigate("/usercreate")
            
//             }}>Sign up</span>
//           </p>

//   <p className="text-center text-sm text-gray-200">
          
//             <span className="text-blue-300 cursor-pointer" onClick={(e) => {
//               e.preventDefault();
//               navigate("/usertype");
//             }}>User type</span>
//           </p> */}
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Swal from "sweetalert2";
import {
  Eye,
  EyeOff,
  Lock,
  User,
} from "lucide-react";

function Login() {
  const [name, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const [errors, setErrors] = useState({});
  const [LoadingItem, setLoadingItem] =
    useState(false);

  const navigate = useNavigate();

// ✅ REPLACE WITH THIS
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
      localStorage.setItem("token", api.token);
      localStorage.setItem("user", JSON.stringify(api.user));
    }

    Swal.fire({
      icon: "success",
      title: "Welcome!",
      text: "Login Successful",
      timer: 1500,
      showConfirmButton: false,
    });

    navigate("/dashboard");

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
//   const handleLogin = (e) => {
//     e.preventDefault();

//     let newErrors = {};

//     if (!name)
//       newErrors.name = "Username is required";

//     if (!password)
//       newErrors.password = "Password is required";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setErrors({});
//     setLoadingItem(true);

//     API.post(`/login`, {
//       name,
//       password,
//     })

//       .then((res) => {
//         const api = res.data;

//          console.log(res.data);

//         if (
//           api.status === false &&
//           api.message === "Invalid Credentials"
//         ) {
//           Swal.fire({
//             icon: "error",
//             title: "Login Failed",
//             text: "Invalid Username or Password",
//           });

//           return;
//         }

//         if (api.token) {
//           localStorage.setItem(
//             "token",
//             api.token
//           );

//           localStorage.setItem(
//             "user",
//             JSON.stringify(api.user)
//           );
//         }

//         Swal.fire({
//           icon: "success",
//           title: "Welcome",
//           text: "Login Successful",
//           timer: 1500,
//           showConfirmButton: false,
//         });

//         navigate("/dashboard");
//       })
//       .catch((err) => {

//   console.log("ERROR", err);

//   if (err.response) {

//     alert(
//       "STATUS: " + err.response.status +
//       "\nDATA: " + JSON.stringify(err.response.data)
//     );

//   } else {

//     alert("NETWORK ERROR: " + err.message);

//   }

// })

//   //     .catch((err) => {

//   //        alert("FULL ERROR", err);

//   // alert("ERROR RESPONSE", err.response);

//   // alert("ERROR DATA", err.response?.data);

//   // alert(JSON.stringify(err.response?.data));
//   //       if (err.response) {
//   //         const status = err.response.status;

//   //         if (status === 401) {
//   //           Swal.fire(
//   //             "Error",
//   //             "Invalid Credentials",
//   //             "error"
//   //           );
//   //         } else if (status === 422) {
//   //           Swal.fire(
//   //             "Error",
//   //             "Validation failed",
//   //             "error"
//   //           );
//   //         } else if (status === 500) {
//   //           Swal.fire(
//   //             "Error",
//   //             "Server error, try again later",
//   //             "error"
//   //           );
//   //         } else {
//   //           Swal.fire(
//   //             "Error",
//   //             "Something went wrong",
//   //             "error"
//   //           );
//   //         }
//   //       } else {
//   //         Swal.fire(
//   //           "Error",
//   //           "Network error",
//   //           "error"
//   //         );
//   //       }
//   //     })

//       .finally(() => {
//         setLoadingItem(false);
//       });
//   };

  return (
    <div className="min-h-screen bg-[#ececff] flex items-center justify-center p-4 overflow-hidden relative">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6d4df2] via-[#8d38f5] to-[#b35ca1 ]" />

      {/* Blur */}
      <div className="absolute top-[-120px] right-[-100px] w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-120px] left-[-100px] w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-sm">

        <div className="bg-white/12 backdrop-blur-2xl border border-white/20 rounded-[35px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

          {/* Header */}
          <div className="px-6 pt-8 pb-6">

           

            {/* Search Style Title */}
            <div className="mt-8 bg-gradient-to-r from-[#5c43e6] to-[#ff4fa3] rounded-[28px] p-5 shadow-xl">

              <h2 className="text-white text-2xl font-bold leading-tight">
                Welcome Back 👋
              </h2>

              <p className="text-white/70 text-sm mt-2">
              Login Here
                {/* Login to manage quotations & customers */}
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-t-[38px] px-6 pt-8 pb-8">

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Username */}
              <div>

                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Username
                </label>

                <div className="h-14 rounded-2xl bg-[#f5f7ff] border border-[#e2e8f0] flex items-center px-4 focus-within:border-[#7c4dff] transition-all">

                  <User
                    size={18}
                    className="text-[#7c4dff] mr-3"
                  />

                  <input
                    type="text"
                    placeholder="Enter username"
                    value={name}
                    onChange={(e) =>
                      setUserName(e.target.value)
                    }
                    className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                  />
                </div>

                {errors.name && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>

                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Password
                </label>

                <div className="h-14 rounded-2xl bg-[#f5f7ff] border border-[#e2e8f0] flex items-center px-4 focus-within:border-[#ff4fa3] transition-all">

                  <Lock
                    size={18}
                    className="text-[#ff4fa3] mr-3"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot */}
              <div className="flex justify-end">

                <button
                  type="button"
                  className="text-sm text-[#7c4dff] font-semibold"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login */}
              <button
                type="submit"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#6d4df2] to-[#ff4fa3] text-white font-bold text-base shadow-xl active:scale-[0.98] transition-all"
              >
                {LoadingItem
                  ? "Please wait..."
                  : "Login"}
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

            <p className="text-gray-700 text-sm font-medium">
              Logging In...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;