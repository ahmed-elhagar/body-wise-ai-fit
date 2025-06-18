
import { Layout } from "@/components/Layout";
import { DashboardHeader } from "./DashboardHeader";
import { QuickActionsGrid } from "./QuickActionsGrid";
import { RecentActivityCard } from "./RecentActivityCard";
import { useDashboardData } from "../hooks";
import { EnhancedPageLoading } from "@/components/EnhancedPageLoading";

const CanonicalDashboard = () => {
  const { data: dashboardData, isLoading } = useDashboardData();

  if (isLoading) {
    return <EnhancedPageLoading message="Loading Dashboard" />;
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
