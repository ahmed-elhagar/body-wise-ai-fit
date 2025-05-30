
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import UsersTable from "@/components/admin/UsersTable";
import SubscriptionsTab from "@/components/admin/SubscriptionsTab";
import CoachesTab from "@/components/admin/CoachesTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import UserGenerationManager from "@/components/admin/UserGenerationManager";
import { useRole } from "@/hooks/useRole";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const { isAdmin, isLoading } = useRole();

  // Fetch real users data
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin
  });

  // Fetch real stats data
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersCount, activeSessionsCount, subscriptionsCount, generationsCount] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('active_sessions').select('*', { count: 'exact' }),
        supabase.from('subscriptions').select('*', { count: 'exact' }).eq('status', 'active'),
        supabase.from('ai_generation_logs').select('*', { count: 'exact' })
      ]);

      return {
        totalUsers: usersCount.count || 0,
        activeSessions: activeSessionsCount.count || 0,
        activeSubscriptions: subscriptionsCount.count || 0,
        totalGenerations: generationsCount.count || 0
      };
    },
    enabled: isAdmin
  });

  if (isLoading || isLoadingUsers || isLoadingStats) {
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
            <AdminHeader />
            <StatsCards stats={stats} />
            
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 shadow-sm">
                <TabsTrigger 
                  value="users" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger 
                  value="subscriptions" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Subscriptions
                </TabsTrigger>
                <TabsTrigger 
                  value="coaches" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Coaches
                </TabsTrigger>
                <TabsTrigger 
                  value="generations" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  AI Generations
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="mt-6">
                <UsersTable users={users} />
              </TabsContent>

              <TabsContent value="subscriptions" className="mt-6">
                <SubscriptionsTab />
              </TabsContent>

              <TabsContent value="coaches" className="mt-6">
                <CoachesTab />
              </TabsContent>

              <TabsContent value="generations" className="mt-6">
                <UserGenerationManager />
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

export default Admin;
