
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import UserGenerationManager from "@/components/admin/UserGenerationManager";
import ActiveSessionsTable from "@/components/admin/ActiveSessionsTable";
import UsersTable from "@/components/admin/UsersTable";
import GenerationLogsTable from "@/components/admin/GenerationLogsTable";

const AdminPanel = () => {
  const queryClient = useQueryClient();
  const { forceLogoutAllUsers } = useAuth();

  // Fetch all users with their profiles
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch AI generation logs
  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ['admin-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_generation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch active sessions
  const { data: activeSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .order('last_activity', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Update user AI generations
  const updateGenerations = useMutation({
    mutationFn: async ({ userId, newLimit }: { userId: string; newLimit: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ ai_generations_remaining: parseInt(newLimit) })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('AI generation limit updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      toast.error(`Error updating limit: ${error.message}`);
    },
  });

  // Force logout all users
  const forceLogoutMutation = useMutation({
    mutationFn: forceLogoutAllUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
    },
  });

  const handleUpdateGenerations = (userId: string, newLimit: string) => {
    updateGenerations.mutate({ userId, newLimit });
  };

  if (usersLoading || logsLoading || sessionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation />
        <div className="md:ml-64 p-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-fitness-primary" />
          </div>
        </div>
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const totalGenerations = logs?.length || 0;
  const activeUsers = users?.filter(user => user.ai_generations_remaining > 0).length || 0;
  const totalActiveSessions = activeSessions?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      <div className="md:ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminHeader 
            onForceLogout={() => forceLogoutMutation.mutate()}
            isLoggingOut={forceLogoutMutation.isPending}
          />

          <StatsCards 
            totalUsers={totalUsers}
            activeUsers={activeUsers}
            totalActiveSessions={totalActiveSessions}
            totalGenerations={totalGenerations}
          />

          <UserGenerationManager 
            users={users || []}
            onUpdateGenerations={handleUpdateGenerations}
            isUpdating={updateGenerations.isPending}
          />

          <ActiveSessionsTable activeSessions={activeSessions || []} />

          <UsersTable users={users || []} />

          <GenerationLogsTable logs={logs || []} />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
