import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ roles }) {
  const { isAuthenticated, user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <div className="flex min-h-screen items-center justify-center text-slate-300">Loading secure workspace...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
