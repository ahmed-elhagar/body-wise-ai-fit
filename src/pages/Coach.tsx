
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { useCoach } from "@/hooks/useCoach";
import { useI18n } from "@/hooks/useI18n";
import { Navigate } from "react-router-dom";
import { CoachHeader } from "@/components/coach/CoachHeader";
import { CoachStatsCards } from "@/components/coach/CoachStatsCards";
import { CoachTabs } from "@/components/coach/CoachTabs";

const Coach = () => {
  const { trainees, isLoading, isCoach } = useCoach();
  const { t } = useI18n();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Mock stats data for now
  const coachStats = {
    totalClients: trainees?.length || 0,
    messagesToday: 0,
    successRate: 85,
    monthlyGoals: 12
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!isCoach) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-3 md:p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            <CoachHeader totalClients={coachStats.totalClients} />
            <CoachStatsCards stats={coachStats} />
            <CoachTabs 
              trainees={trainees} 
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Coach;
