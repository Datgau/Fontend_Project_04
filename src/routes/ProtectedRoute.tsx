import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, user, loading } = useAuth();
  const location = useLocation();

  // Debug logs
  console.log("ProtectedRoute - Loading:", loading);
  console.log("ProtectedRoute - IsLoggedIn:", isLoggedIn);
  console.log("ProtectedRoute - User:", user);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn || !user) {
    console.log("ProtectedRoute - Redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role?.toUpperCase() || "")) {
    return <Navigate to="/heartbeat/home" replace />;
  }

  // User is authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;
