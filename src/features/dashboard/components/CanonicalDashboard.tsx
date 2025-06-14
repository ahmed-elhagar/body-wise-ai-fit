
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import QuickActionsGrid from "./QuickActionsGrid";
import RecentActivityCard from "./RecentActivityCard";
import DashboardHeader from "./DashboardHeader";
import { Zap, Activity } from "lucide-react";
import EnhancedPageLoading from "@/components/EnhancedPageLoading";

const CanonicalDashboard = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();

  if (!profile) {
    return <EnhancedPageLoading />;
  }

  const userName = profile.first_name || 'User';

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Enhanced Dashboard Header */}
              <DashboardHeader userName={userName} />
              
              {/* Quick Actions Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Quick Actions
                  </h2>
                </div>
                <QuickActionsGrid />
              </div>

              {/* Recent Activity Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Recent Activity
                  </h2>
                </div>
                <RecentActivityCard />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CanonicalDashboard;
