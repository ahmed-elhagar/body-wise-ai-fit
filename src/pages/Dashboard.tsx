
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { EnhancedPageLoading } from "@/components/loading/EnhancedPageLoading";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { t } = useLanguage();

  // Show enhanced loading while profile is being fetched
  if (authLoading || profileLoading) {
    return (
      <EnhancedPageLoading 
        title={t('Loading Dashboard')}
        subtitle={t('Preparing your fitness overview...')}
        estimatedTime={3}
      />
    );
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
