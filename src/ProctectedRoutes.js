import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { isAuthenticated } from "./pages/Api";

const ProtectedRoutes = () => {
  const auth = isAuthenticated();

  return auth ? <Outlet /> : <Navigate to="/connexion" />;
};

export default ProtectedRoutes;
