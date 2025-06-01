
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  // Redirect to the main Auth page
  return <Navigate to="/auth" replace />;
};

export default Login;
