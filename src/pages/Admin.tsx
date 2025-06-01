
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, TrendingUp, CreditCard, Settings, Brain, Activity } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { Navigate } from "react-router-dom";
import UsersTable from "@/components/admin/UsersTable";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import SubscriptionsTab from "@/components/admin/SubscriptionsTab";
import CoachesTab from "@/components/admin/CoachesTab";
import EnhancedStatsCards from "@/components/admin/EnhancedStatsCards";
import SystemHealthMonitor from "@/components/admin/SystemHealthMonitor";
import UserGenerationManager from "@/components/admin/UserGenerationManager";
import AIModelsTab from "@/components/admin/AIModelsTab";

const Admin = () => {
  const { isAdmin, isLoading } = useRole();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="animate-pulse space-y-4">
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

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ProtectedRoute>
      <Layout>
        <PageHeader
          title="Admin Panel"
          description="Manage users, analytics, and system settings"
          icon={<Shield className="h-6 w-6 text-purple-600" />}
        />

        <div className="space-y-6">
          {/* Enhanced Stats Cards */}
          <EnhancedStatsCards />
          
          {/* System Health Monitor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SystemHealthMonitor />
            </div>
            <div className="lg:col-span-1">
              <UserGenerationManager />
            </div>
          </div>
          
          {/* Main Admin Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="subscriptions" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Subscriptions
              </TabsTrigger>
              <TabsTrigger 
                value="coaches" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Coaches
              </TabsTrigger>
              <TabsTrigger 
                value="ai-models" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Models
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                System
              </TabsTrigger>
            </TabsList>

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SystemHealthMonitor />
                <UserGenerationManager />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Admin;
