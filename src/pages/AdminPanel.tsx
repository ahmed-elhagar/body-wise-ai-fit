
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Settings, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newGenerationCount, setNewGenerationCount] = useState('5');

  // Redirect if not admin
  if (!isAdmin) {
    navigate('/dashboard');
    return null;
  }

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const resetGenerationsMutation = useMutation({
    mutationFn: async ({ userId, count }: { userId: string; count: number }) => {
      const { error } = await supabase.rpc('reset_ai_generations', {
        target_user_id: userId,
        new_count: count
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('AI generations reset successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSelectedUserId('');
      setNewGenerationCount('5');
    },
    onError: (error) => {
      console.error('Error resetting generations:', error);
      toast.error('Failed to reset AI generations');
    },
  });

  const handleResetGenerations = () => {
    if (!selectedUserId || !newGenerationCount) {
      toast.error('Please select a user and enter a count');
      return;
    }

    resetGenerationsMutation.mutate({
      userId: selectedUserId,
      count: parseInt(newGenerationCount)
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-600">Manage users and system settings</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Users Management */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center mb-6">
                <Users className="w-5 h-5 text-fitness-primary mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Users Management</h3>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users?.map((user) => (
                  <div key={user.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {user.first_name} {user.last_name}
                        </h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.user_roles?.map((role: any) => (
                          <Badge key={role.role} variant={role.role === 'admin' ? 'default' : 'secondary'}>
                            {role.role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">AI Generations</p>
                        <p className="font-semibold">{user.ai_generations_remaining || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Onboarding</p>
                        <Badge variant={user.onboarding_completed ? 'default' : 'destructive'}>
                          {user.onboarding_completed ? 'Complete' : 'Pending'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-gray-600">Goal</p>
                        <p className="font-semibold capitalize">
                          {user.fitness_goal?.replace('_', ' ') || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Activity</p>
                        <p className="font-semibold capitalize">
                          {user.activity_level?.replace('_', ' ') || 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Admin Actions */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center mb-6">
                <Settings className="w-5 h-5 text-fitness-primary mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Admin Actions</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userSelect">Select User</Label>
                  <select
                    id="userSelect"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a user...</option>
                    {users?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="generationCount">AI Generation Count</Label>
                  <Input
                    id="generationCount"
                    type="number"
                    value={newGenerationCount}
                    onChange={(e) => setNewGenerationCount(e.target.value)}
                    placeholder="Enter new count"
                    min="0"
                    max="100"
                  />
                </div>

                <Button
                  onClick={handleResetGenerations}
                  disabled={resetGenerationsMutation.isPending || !selectedUserId}
                  className="w-full bg-fitness-gradient hover:opacity-90 text-white"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${resetGenerationsMutation.isPending ? 'animate-spin' : ''}`} />
                  {resetGenerationsMutation.isPending ? 'Updating...' : 'Reset AI Generations'}
                </Button>
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Users</span>
                  <span className="font-semibold">{users?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Onboarding</span>
                  <span className="font-semibold">
                    {users?.filter(u => u.onboarding_completed).length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Admin Users</span>
                  <span className="font-semibold">
                    {users?.filter(u => u.user_roles?.some((r: any) => r.role === 'admin')).length || 0}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
