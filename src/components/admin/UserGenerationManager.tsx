
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Users, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

  const handleSubmit = async () => {
    if (selectedUserId && newGenerationLimit) {
      const limit = parseInt(newGenerationLimit);
      if (isNaN(limit) || limit < 0) {
        toast.error('Please enter a valid number');
        return;
      }
      
      updateGenerationLimitMutation.mutate({
        userId: selectedUserId,
        newLimit: limit
      });
    }
  };

  const selectedUser = users.find(user => user.id === selectedUserId);

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
      <Card className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Update AI Generation Limits</h2>
            <p className="text-sm text-gray-600">Manage user generation quotas and limits</p>
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
              <p className="text-xs text-gray-500 mt-1">
                Current limit: {selectedUser.ai_generations_remaining} generations
              </p>
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

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found in the system.
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserGenerationManager;
