
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import CoachHeader from "@/components/coach/CoachHeader";
import CoachStatsCards from "@/components/coach/CoachStatsCards";
import TraineesTab from "@/components/coach/TraineesTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import { useRole } from "@/hooks/useRole";
import { Navigate } from "react-router-dom";

const Coach = () => {
  const { isAdmin, isLoading } = useRole();

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

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-3 md:p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            <CoachHeader />
            <CoachStatsCards />
            
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
                <TraineesTab />
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
