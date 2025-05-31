
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { EnhancedTraineesTab } from "@/components/coach/EnhancedTraineesTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import { useRole } from "@/hooks/useRole";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Users } from "lucide-react";

const Coach = () => {
  const { isAdmin, isCoach: isRoleCoach, isLoading: isRoleLoading } = useRole();
  const { trainees, isLoadingTrainees, isCoach: isSystemCoach, error, refetchTrainees } = useCoachSystem();

  const isLoading = isRoleLoading || isLoadingTrainees;
  const isCoach = isAdmin || isRoleCoach || isSystemCoach;

  console.log('Coach page - isAdmin:', isAdmin, 'isRoleCoach:', isRoleCoach, 'isSystemCoach:', isSystemCoach, 'trainees:', trainees?.length);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Allow access for both coaches and admins
  if (!isCoach) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show error state if there's an error fetching trainees
  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <PageHeader
            title="Coach Panel"
            description="Manage and support your trainees"
            icon={<Users className="h-6 w-6 text-green-600" />}
          />
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">
                    Error Loading Trainee Data
                  </h3>
                  <p className="text-red-700 mb-4">
                    {error?.message || 'Unable to load trainee information. Please try refreshing the page.'}
                  </p>
                  <button 
                    onClick={() => refetchTrainees()}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <PageHeader
          title="Coach Panel"
          description="Advanced trainee management and coaching tools"
          icon={<Users className="h-6 w-6 text-green-600" />}
        />
        
        <div className="space-y-6">
          <Tabs defaultValue="trainees" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
              <TabsTrigger 
                value="trainees" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Trainees Management
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Analytics & Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trainees" className="mt-6">
              <EnhancedTraineesTab 
                trainees={trainees} 
                onChatClick={(traineeId) => {
                  console.log('Chat with trainee:', traineeId);
                }} 
              />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <AnalyticsTab />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Coach;
