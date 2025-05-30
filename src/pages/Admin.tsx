
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import UsersTable from "@/components/admin/UsersTable";
import SubscriptionsTab from "@/components/admin/SubscriptionsTab";
import CoachesTab from "@/components/admin/CoachesTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import GenerationLogsTable from "@/components/admin/GenerationLogsTable";
import ActiveSessionsTable from "@/components/admin/ActiveSessionsTable";
import UserGenerationManager from "@/components/admin/UserGenerationManager";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const Admin = () => {
  const { forceLogoutAllUsers } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch users data from database
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, ai_generations_remaining, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch AI generation logs from database
  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['admin-generation-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_generation_logs')
        .select('id, generation_type, status, user_id, created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch active sessions from database
  const { data: activeSessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['admin-active-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('id, user_id, session_id, last_activity, user_agent')
        .order('last_activity', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch admin stats from database
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users (users who have used AI generations in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: activeUsersData } = await supabase
        .from('ai_generation_logs')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      const activeUsers = new Set(activeUsersData?.map(log => log.user_id) || []).size;

      // Get total AI generations
      const { count: totalGenerations } = await supabase
        .from('ai_generation_logs')
        .select('*', { count: 'exact', head: true });

      // Get active sessions count
      const { count: totalActiveSessions } = await supabase
        .from('active_sessions')
        .select('*', { count: 'exact', head: true });

      return {
        totalUsers: totalUsers || 0,
        activeUsers,
        totalActiveSessions: totalActiveSessions || 0,
        totalGenerations: totalGenerations || 0
      };
    }
  });

  const handleForceLogout = async () => {
    setIsLoggingOut(true);
    try {
      await forceLogoutAllUsers();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleUpdateGenerations = async (userId: string, newLimit: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ai_generations_remaining: parseInt(newLimit) })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('AI generation limit updated successfully');
      // Refetch users data to show updated limit
      // This will be handled automatically by React Query
    } catch (error: any) {
      toast.error(`Failed to update generation limit: ${error.message}`);
    }
  };

  if (usersLoading || logsLoading || sessionsLoading) {
    return (
      <ProtectedRoute requireRole="admin">
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading admin data...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole="admin">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <AdminHeader onForceLogout={handleForceLogout} isLoggingOut={isLoggingOut} />
          <StatsCards 
            totalUsers={stats?.totalUsers || 0}
            activeUsers={stats?.activeUsers || 0}
            totalActiveSessions={stats?.totalActiveSessions || 0}
            totalGenerations={stats?.totalGenerations || 0}
          />
          
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="users" data-testid="users-tab">Users</TabsTrigger>
              <TabsTrigger value="subscriptions" data-testid="subscriptions-tab">Subscriptions</TabsTrigger>
              <TabsTrigger value="coaches" data-testid="coaches-tab">Coaches</TabsTrigger>
              <TabsTrigger value="analytics" data-testid="analytics-tab">Analytics</TabsTrigger>
              <TabsTrigger value="generations" data-testid="generations-tab">AI Logs</TabsTrigger>
              <TabsTrigger value="sessions" data-testid="sessions-tab">Sessions</TabsTrigger>
              <TabsTrigger value="credits" data-testid="credits-tab">Credits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              <UsersTable users={users} />
            </TabsContent>
            
            <TabsContent value="subscriptions" className="space-y-4">
              <SubscriptionsTab />
            </TabsContent>
            
            <TabsContent value="coaches" className="space-y-4">
              <CoachesTab />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <AnalyticsTab />
            </TabsContent>
            
            <TabsContent value="generations" className="space-y-4">
              <GenerationLogsTable logs={logs} />
            </TabsContent>
            
            <TabsContent value="sessions" className="space-y-4">
              <ActiveSessionsTable activeSessions={activeSessions} />
            </TabsContent>
            
            <TabsContent value="credits" className="space-y-4">
              <UserGenerationManager 
                users={users}
                onUpdateGenerations={handleUpdateGenerations}
                isUpdating={false}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
