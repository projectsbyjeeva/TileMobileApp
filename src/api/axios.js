// import axios from "axios";

// const API = axios.create({
//   VITE_API_URL= "http://192.168.1.11:8000/api",

//   baseURL: import.meta.env.VITE_API_URL,
//   timeout: 10000,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });

// // Attach token automatically
// API.interceptors.request.use((config) => {

//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// // Handle errors
// API.interceptors.response.use(

//   (response) => response,

//   (error) => {

//     console.log("AXIOS ERROR:", error);

//     if (error.response) {

//       console.log("ERROR RESPONSE:", error.response.data);

//       alert(JSON.stringify(error.response.data));

//       if (error.response.status === 401) {

//         localStorage.removeItem("token");

//         window.location.href = "/";
//       }

//     } else {

//       console.log("NETWORK ERROR:", error.message);

//       alert(error.message);
//     }

//     return Promise.reject(error);
//   }
// );

import axios from "axios";

const API = axios.create({
  baseURL: "http://10.42.97.57:8000/api",
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally - NO alerts
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;
