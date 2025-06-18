
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, TrendingUp, CreditCard, Settings, Brain } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { Navigate } from "react-router-dom";
import {
  UsersTable,
  AnalyticsTab,
  SubscriptionsTab,
  CoachesTab,
  EnhancedStatsCards,
  EnhancedSystemTab,
  AIModelsTab
} from "@/features/admin/components";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const Admin = () => {
  const { isAdmin, isLoading, error } = useRole();

  if (isLoading) {
    return (
      <ProtectedRoute requireRole="admin">
        <Layout>
          <div className="animate-pulse space-y-4 p-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <Card className="p-6 bg-red-50 border-red-200 max-w-md mx-auto mt-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h2 className="text-lg font-semibold text-red-800">Authentication Error</h2>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <p className="text-sm text-red-600">Please try refreshing the page or contact support if the issue persists.</p>
          </Card>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ProtectedRoute requireRole="admin">
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
          <PageHeader
            title="Admin Panel"
            description="Manage users, analytics, and system settings"
            icon={<Shield className="h-6 w-6 text-purple-600" />}
          />

          <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            {/* Enhanced Stats Cards */}
            <EnhancedStatsCards />
            
            {/* Main Admin Tabs */}
            <Tabs defaultValue="users" className="w-full">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-6 min-w-[600px] md:min-w-0 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
                  <TabsTrigger 
                    value="users" 
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm"
                  >
                    <Users className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Users</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm"
                  >
                    <TrendingUp className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="subscriptions" 
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm"
                  >
                    <CreditCard className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Subscriptions</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="coaches" 
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm"
                  >
                    <Shield className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Coaches</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ai-models" 
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm"
                  >
                    <Brain className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">AI Models</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="system" 
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm"
                  >
                    <Settings className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">System</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="users" className="mt-6">
                <UsersTable />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <AnalyticsTab />
              </TabsContent>

              <TabsContent value="subscriptions" className="mt-6">
                <SubscriptionsTab />
              </TabsContent>

              <TabsContent value="coaches" className="mt-6">
                <CoachesTab />
              </TabsContent>

              <TabsContent value="ai-models" className="mt-6">
                <AIModelsTab />
              </TabsContent>

              <TabsContent value="system" className="mt-6">
                <EnhancedSystemTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Admin;
