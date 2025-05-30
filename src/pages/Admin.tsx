
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureFlagToggle } from "@/components/admin/FeatureFlagToggle";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import UsersTable from "@/components/admin/UsersTable";
import ActiveSessionsTable from "@/components/admin/ActiveSessionsTable";
import GenerationLogsTable from "@/components/admin/GenerationLogsTable";
import UserGenerationManager from "@/components/admin/UserGenerationManager";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const { user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryClient = useQueryClient();

  // Check if user has admin role
  const { data: hasAdminRole, isLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
      
      return !error && data;
    },
    enabled: !!user?.id
  });

  // Fetch admin stats
  const { data: adminStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersResult, sessionsResult, logsResult] = await Promise.all([
        supabase.from('profiles').select('id, first_name, last_name, email, ai_generations_remaining, created_at'),
        supabase.from('active_sessions').select('*'),
        supabase.from('ai_generation_logs').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      return {
        users: usersResult.data || [],
        activeSessions: sessionsResult.data || [],
        generationLogs: logsResult.data || [],
        totalUsers: usersResult.data?.length || 0,
        activeUsers: usersResult.data?.filter(u => u.ai_generations_remaining > 0).length || 0,
        totalActiveSessions: sessionsResult.data?.length || 0,
        totalGenerations: logsResult.data?.length || 0,
      };
    },
    enabled: !!hasAdminRole
  });

  // Force logout mutation
  const forceLogoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('active_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('All users have been logged out');
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error) => {
      console.error('Force logout error:', error);
      toast.error('Failed to logout users');
    }
  });

  // Update generation limit mutation
  const updateGenerationMutation = useMutation({
    mutationFn: async ({ userId, newLimit }: { userId: string; newLimit: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ ai_generations_remaining: parseInt(newLimit) })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Generation limit updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error) => {
      console.error('Update generation limit error:', error);
      toast.error('Failed to update generation limit');
    }
  });

  const handleForceLogout = async () => {
    if (window.confirm('Are you sure you want to force logout all users?')) {
      setIsLoggingOut(true);
      await forceLogoutMutation.mutateAsync();
      setIsLoggingOut(false);
    }
  };

  const handleUpdateGenerations = (userId: string, newLimit: string) => {
    updateGenerationMutation.mutate({ userId, newLimit });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user || !hasAdminRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <AdminHeader onForceLogout={handleForceLogout} isLoggingOut={isLoggingOut} />

        {adminStats && (
          <>
            <StatsCards
              totalUsers={adminStats.totalUsers}
              activeUsers={adminStats.activeUsers}
              totalActiveSessions={adminStats.totalActiveSessions}
              totalGenerations={adminStats.totalGenerations}
            />

            <UserGenerationManager
              users={adminStats.users}
              onUpdateGenerations={handleUpdateGenerations}
              isUpdating={updateGenerationMutation.isPending}
            />

            <UsersTable users={adminStats.users} />

            <ActiveSessionsTable activeSessions={adminStats.activeSessions} />

            <GenerationLogsTable logs={adminStats.generationLogs} />
          </>
        )}

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Feature Management</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureFlagToggle />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
