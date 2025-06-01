
import { Navigate } from "react-router-dom";

const CoachPanel = () => {
  // Redirect to the Coach page
  return <Navigate to="/coach" replace />;
};

export default CoachPanel;
