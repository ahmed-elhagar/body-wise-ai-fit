
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { GoalsDashboard } from "@/features/goals";

const Goals = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <GoalsDashboard />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Goals;
