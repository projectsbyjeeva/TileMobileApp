import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";


function ProtectedRoute({ children }) {

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  const checkLogin = async () => {

    const { value } = await Preferences.get({
      key:"token",
    });

    setToken(value);
    setLoading(false);

  };
    checkLogin();

},[]);

if(loading){

  return <div>Loading...</div>;
}

if(!token){
  return  <Navigate to="/" replace />;

}

  return children;
}

export default ProtectedRoute;