
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  // Redirect to the Admin page
  return <Navigate to="/admin" replace />;
};

export default AdminDashboard;
