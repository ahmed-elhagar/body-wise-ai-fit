
import { Layout } from "@/components/Layout";
import { DashboardHeader } from "./DashboardHeader";
import { QuickActionsGrid } from "./QuickActionsGrid";
import { RecentActivityCard } from "./RecentActivityCard";
import { useDashboardData } from "../hooks";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";

const CanonicalDashboard = () => {
  const { data: dashboardData, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <SimpleLoadingIndicator
          message="Loading Dashboard"
          description="Please wait while we load your dashboard..."
          size="lg"
        />
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <DashboardHeader stats={dashboardData} />
          <QuickActionsGrid />
          <RecentActivityCard />
        </div>
      </div>
    </Layout>
  );
};

export default CanonicalDashboard;
