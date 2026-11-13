import {
  Navigate,
  Outlet
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        Checking authentication...
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate to="/login" replace />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;