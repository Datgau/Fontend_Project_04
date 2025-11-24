import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../../routes/AuthContext";

// Component to redirect based on auth state
const AuthRedirect = () => {
  const { isLoggedIn, loading } = useAuth();

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

  // Redirect to home if logged in, otherwise to login
  return <Navigate to={isLoggedIn ? "/heartbeat/home" : "/login"} replace />;
};

export default AuthRedirect;
