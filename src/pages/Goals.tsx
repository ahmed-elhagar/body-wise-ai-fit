
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import SmartGoalsDashboard from "@/components/goals/SmartGoalsDashboard";

const Goals = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto">
            <SmartGoalsDashboard />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Goals;
