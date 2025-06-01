
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Users, Settings, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  ai_generations_remaining: number;
}

const UserGenerationManager = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newGenerationLimit, setNewGenerationLimit] = useState('');
  const [bulkUpdateLimit, setBulkUpdateLimit] = useState('');
  const queryClient = useQueryClient();

  // Fetch real users data
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users-for-generation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, ai_generations_remaining')
        .order('first_name', { ascending: true });
      
      if (error) throw error;
      return data as UserProfile[];
    }
  });

  // Update user generation limit mutation
  const updateGenerationLimitMutation = useMutation({
    mutationFn: async ({ userId, newLimit }: { userId: string; newLimit: number }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ai_generations_remaining: newLimit,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-for-generation'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Generation limit updated successfully');
      setSelectedUserId('');
      setNewGenerationLimit('');
    },
    onError: (error) => {
      console.error('Failed to update generation limit:', error);
      toast.error('Failed to update generation limit');
    }
  });

  // Bulk update mutation for all users
  const bulkUpdateMutation = useMutation({
    mutationFn: async (newLimit: number) => {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ai_generations_remaining: newLimit,
          updated_at: new Date().toISOString()
        })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all real users
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-for-generation'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('All user generation limits updated successfully');
      setBulkUpdateLimit('');
    },
    onError: (error) => {
      console.error('Failed to bulk update generation limits:', error);
      toast.error('Failed to bulk update generation limits');
    }
  });

  const handleSubmit = async () => {
    if (selectedUserId && newGenerationLimit) {
      const limit = parseInt(newGenerationLimit);
      if (isNaN(limit) || limit < 0) {
        toast.error('Please enter a valid number (0 or greater)');
        return;
      }
      
      updateGenerationLimitMutation.mutate({
        userId: selectedUserId,
        newLimit: limit
      });
    }
  };

  const handleBulkUpdate = async () => {
    if (bulkUpdateLimit) {
      const limit = parseInt(bulkUpdateLimit);
      if (isNaN(limit) || limit < 0) {
        toast.error('Please enter a valid number (0 or greater)');
        return;
      }
      
      if (confirm(`Are you sure you want to set ALL users' generation limits to ${limit}? This action cannot be undone.`)) {
        bulkUpdateMutation.mutate(limit);
      }
    }
  };

  const selectedUser = users.find(user => user.id === selectedUserId);
  
  // Calculate statistics
  const totalUsers = users.length;
  const averageCredits = users.length > 0 ? Math.round(users.reduce((sum, user) => sum + user.ai_generations_remaining, 0) / users.length) : 0;
  const usersWithZeroCredits = users.filter(user => user.ai_generations_remaining === 0).length;

  if (isLoadingUsers) {
    return (
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading users...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Card */}
      <Card className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Credit Statistics</h3>
            <p className="text-sm text-gray-600">Overview of AI generation credits across all users</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{averageCredits}</div>
            <div className="text-sm text-gray-600">Average Credits</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-red-600">{usersWithZeroCredits}</div>
            <div className="text-sm text-gray-600">Users with 0 Credits</div>
          </div>
        </div>
      </Card>

      {/* Individual User Update */}
      <Card className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Update Individual User Limit</h2>
            <p className="text-sm text-gray-600">Manage specific user generation quotas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="user-select" className="text-sm font-medium text-gray-700">Select User</Label>
            <select
              id="user-select"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email}) - Current: {user.ai_generations_remaining}
                </option>
              ))}
            </select>
            {selectedUser && (
              <Alert className="mt-2">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Current limit: {selectedUser.ai_generations_remaining} generations
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <Label htmlFor="generation-limit" className="text-sm font-medium text-gray-700">New Generation Limit</Label>
            <Input
              id="generation-limit"
              type="number"
              min="0"
              value={newGenerationLimit}
              onChange={(e) => setNewGenerationLimit(e.target.value)}
              placeholder="Enter new limit"
              className="mt-1 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleSubmit}
              disabled={updateGenerationLimitMutation.isPending || !selectedUserId || !newGenerationLimit}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {updateGenerationLimitMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Users className="w-4 h-4 mr-2" />
              )}
              Update Limit
            </Button>
          </div>
        </div>
      </Card>

      {/* Bulk Update Section */}
      <Card className="p-4 md:p-6 bg-orange-50 border border-orange-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Bulk Update All Users</h2>
            <p className="text-sm text-gray-600">Set the same generation limit for all users at once</p>
          </div>
        </div>

        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> This action will update ALL users' generation limits. Use with caution!
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bulk-limit" className="text-sm font-medium text-gray-700">New Limit for All Users</Label>
            <Input
              id="bulk-limit"
              type="number"
              min="0"
              value={bulkUpdateLimit}
              onChange={(e) => setBulkUpdateLimit(e.target.value)}
              placeholder="Enter limit for all users"
              className="mt-1 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleBulkUpdate}
              disabled={bulkUpdateMutation.isPending || !bulkUpdateLimit}
              variant="destructive"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {bulkUpdateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-2" />
              )}
              Update All Users
            </Button>
          </div>
        </div>
      </Card>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No users found in the system.</p>
        </div>
      )}
    </div>
  );
};

export default UserGenerationManager;
