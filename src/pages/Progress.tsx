
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { ProgressDashboard } from "@/features/progress";

const Progress = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <ProgressDashboard />
      </Layout>
    </ProtectedRoute>
  );
};

export default Progress;
