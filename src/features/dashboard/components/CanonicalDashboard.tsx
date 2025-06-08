
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { QuickActionsGrid } from "./QuickActionsGrid";
import { RecentActivityCard } from "./RecentActivityCard";
import { DashboardHeader } from "./DashboardHeader";
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
            <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
              {/* Dashboard Header */}
              <DashboardHeader userName={userName} />
              
              {/* Quick Actions Grid */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  Quick Actions
                </h2>
                <QuickActionsGrid />
              </div>

              {/* Recent Activity */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-600" />
                  Recent Activity
                </h2>
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
