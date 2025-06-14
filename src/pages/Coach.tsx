
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Star } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { Navigate } from "react-router-dom";
import { CoachDashboard } from "@/features/coach/components";
import { useLanguage } from "@/contexts/LanguageContext";

const Coach = () => {
  const { isCoach, isAdmin, isLoading } = useRole();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Only coaches and admins can access this page
  if (!isCoach && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ProtectedRoute requireRole="coach">
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <PageHeader
            title={t('Coach Dashboard')}
            description={t('Manage your trainees and track their progress')}
            icon={<Star className="h-6 w-6 text-green-600" />}
          />

          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <CoachDashboard />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Coach;
