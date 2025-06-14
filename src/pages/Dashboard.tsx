
import { CanonicalDashboard } from "@/features/dashboard";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <CanonicalDashboard />
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;
