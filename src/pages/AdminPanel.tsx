
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Users, TrendingUp, Activity, Crown, LogOut, Shield } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useSessionManager } from "@/hooks/useSessionManager";

const AdminPanel = () => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newGenerationLimit, setNewGenerationLimit] = useState("");
  const queryClient = useQueryClient();
  const { forceLogoutAllUsers } = useSessionManager();

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
    mutationFn: async () => {
      if (!selectedUserId || !newGenerationLimit) {
        throw new Error('Please select a user and enter a valid limit');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ ai_generations_remaining: parseInt(newGenerationLimit) })
        .eq('id', selectedUserId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('AI generation limit updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSelectedUserId("");
      setNewGenerationLimit("");
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-yellow-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
            </div>
            
            {/* Force Logout All Users Button */}
            <Button
              onClick={() => forceLogoutMutation.mutate()}
              disabled={forceLogoutMutation.isPending}
              variant="destructive"
              className="flex items-center space-x-2"
            >
              {forceLogoutMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span>Force Logout All Users</span>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-800">{activeUsers}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-gray-800">{totalActiveSessions}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total AI Generations</p>
                  <p className="text-2xl font-bold text-gray-800">{totalGenerations}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Update AI Generations */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Update AI Generation Limits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="user-select">Select User</Label>
                <select
                  id="user-select"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value="">Choose a user...</option>
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="generation-limit">New Generation Limit</Label>
                <Input
                  id="generation-limit"
                  type="number"
                  value={newGenerationLimit}
                  onChange={(e) => setNewGenerationLimit(e.target.value)}
                  placeholder="Enter new limit"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => updateGenerations.mutate()}
                  disabled={updateGenerations.isPending || !selectedUserId || !newGenerationLimit}
                  className="w-full"
                >
                  {updateGenerations.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Update Limit
                </Button>
              </div>
            </div>
          </Card>

          {/* Active Sessions Table */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">User ID</th>
                    <th className="text-left py-2">Session ID</th>
                    <th className="text-left py-2">Last Activity</th>
                    <th className="text-left py-2">User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSessions?.map((session) => (
                    <tr key={session.id} className="border-b">
                      <td className="py-2 font-mono text-xs">{session.user_id.slice(0, 8)}...</td>
                      <td className="py-2 font-mono text-xs">{session.session_id.slice(0, 8)}...</td>
                      <td className="py-2">{new Date(session.last_activity).toLocaleString()}</td>
                      <td className="py-2 max-w-xs truncate">{session.user_agent || 'Unknown'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Users Table */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Users Overview</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">AI Generations Left</th>
                    <th className="text-left py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2">{user.first_name} {user.last_name}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">
                        <Badge variant={user.ai_generations_remaining > 0 ? "default" : "destructive"}>
                          {user.ai_generations_remaining}
                        </Badge>
                      </td>
                      <td className="py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent AI Generation Logs */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Recent AI Generations</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">User ID</th>
                    <th className="text-left py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {logs?.map((log) => (
                    <tr key={log.id} className="border-b">
                      <td className="py-2">
                        <Badge variant="outline">{log.generation_type}</Badge>
                      </td>
                      <td className="py-2">
                        <Badge variant={log.status === 'completed' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </td>
                      <td className="py-2 font-mono text-xs">{log.user_id.slice(0, 8)}...</td>
                      <td className="py-2">{new Date(log.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
