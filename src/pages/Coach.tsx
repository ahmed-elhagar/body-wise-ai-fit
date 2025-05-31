
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { CoachHeader } from "@/components/coach/CoachHeader";
import { CoachStatsCards } from "@/components/coach/CoachStatsCards";
import { TraineesTab } from "@/components/coach/TraineesTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import { useRole } from "@/hooks/useRole";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Users } from "lucide-react";

const Coach = () => {
  const { isAdmin, isCoach, isLoading } = useRole();
  const { trainees, isLoadingTrainees, error } = useCoachSystem();

  if (isLoading || isLoadingTrainees) {
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

  // Allow access for both coaches and admins
  if (!isAdmin && !isCoach) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show error state if there's an error fetching trainees
  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="p-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">
                      Error Loading Trainee Data
                    </h3>
                    <p className="text-red-700">
                      {error?.message || 'Unable to load trainee information. Please try refreshing the page.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const totalClients = trainees.length;
  const completedProfiles = trainees.filter(t => 
    (t.trainee_profile.profile_completion_score || 0) >= 80
  ).length;
  const activeTrainees = trainees.filter(t => 
    (t.trainee_profile.ai_generations_remaining || 0) > 0
  ).length;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-3 md:p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            <CoachHeader totalClients={totalClients} />
            <CoachStatsCards stats={{
              totalClients,
              messagesToday: 0,
              successRate: totalClients > 0 ? Math.round((completedProfiles / totalClients) * 100) : 0,
              monthlyGoals: activeTrainees
            }} />
            
            <Tabs defaultValue="trainees" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 shadow-sm">
                <TabsTrigger 
                  value="trainees" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  My Trainees
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trainees" className="mt-6">
                <TraineesTab trainees={trainees} onChatClick={(traineeId) => {
                  console.log('Chat with trainee:', traineeId);
                }} />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <AnalyticsTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Coach;
