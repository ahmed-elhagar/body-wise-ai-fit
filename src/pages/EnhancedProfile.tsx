
import { Navigate } from "react-router-dom";

const EnhancedProfile = () => {
  // Redirect to the main profile page
  return <Navigate to="/profile" replace />;
};

export default EnhancedProfile;
