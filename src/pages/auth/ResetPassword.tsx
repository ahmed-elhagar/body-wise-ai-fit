
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ResetPassword = () => {
  // Redirect to the main Auth page
  return <Navigate to="/auth" replace />;
};

export default ResetPassword;
