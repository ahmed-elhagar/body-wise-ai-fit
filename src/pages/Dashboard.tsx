
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";

// Simple loading component
const DashboardLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { t } = useLanguage();

  // Show loading while profile is being fetched
  if (authLoading || profileLoading) {
    return <DashboardLoader />;
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <Layout>
        <DashboardContent />
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;
