
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Search, Crown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type UserRole = 'normal' | 'pro' | 'coach' | 'admin';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

interface CoachTrainee {
  id: string;
  coach_id: string;
  trainee_id: string;
  trainee_profile: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const CoachesTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newTraineeEmail, setNewTraineeEmail] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");
  const queryClient = useQueryClient();

  // Get all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(user => ({
        ...user,
        role: (user.role as UserRole) || 'normal'
      })) as UserProfile[];
    }
  });

  // Get coach-trainee relationships
  const { data: coachTrainees, isLoading: coachTraineesLoading } = useQuery({
    queryKey: ['admin-coach-trainees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coach_trainees')
        .select(`
          *,
          profiles!coach_trainees_trainee_id_fkey(first_name, last_name, email)
        `);

      if (error) throw error;
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        ...item,
        trainee_profile: item.profiles || { first_name: '', last_name: '', email: '' }
      })) as CoachTrainee[];
    }
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update role: ${error.message}`);
    }
  });

  const assignTrainee = useMutation({
    mutationFn: async ({ coachId, traineeEmail }: { coachId: string; traineeEmail: string }) => {
      // Find trainee by email
      const trainee = users?.find(u => u.email === traineeEmail);
      if (!trainee) throw new Error('Trainee not found');

      const { data, error } = await supabase
        .from('coach_trainees')
        .insert({
          coach_id: coachId,
          trainee_id: trainee.id
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coach-trainees'] });
      setNewTraineeEmail("");
      setSelectedCoach("");
      toast.success('Trainee assigned successfully');
    },
    onError: (error) => {
      toast.error(`Failed to assign trainee: ${error.message}`);
    }
  });

  const removeTrainee = useMutation({
    mutationFn: async (relationshipId: string) => {
      const { error } = await supabase
        .from('coach_trainees')
        .delete()
        .eq('id', relationshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coach-trainees'] });
      toast.success('Trainee removed successfully');
    },
    onError: (error) => {
      toast.error(`Failed to remove trainee: ${error.message}`);
    }
  });

  const coaches = users?.filter(u => u.role === 'coach' || u.role === 'admin') || [];
  const filteredUsers = users?.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'coach': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignTrainee = () => {
    if (!selectedCoach || !newTraineeEmail.trim()) {
      toast.error("Please select a coach and enter trainee email");
      return;
    }
    
    assignTrainee.mutate({ 
      coachId: selectedCoach, 
      traineeEmail: newTraineeEmail.trim() 
    });
  };

  if (usersLoading || coachTraineesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading coaches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assign Trainee */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Assign Trainee to Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedCoach} onValueChange={setSelectedCoach}>
              <SelectTrigger>
                <SelectValue placeholder="Select coach" />
              </SelectTrigger>
              <SelectContent>
                {coaches.map((coach) => (
                  <SelectItem key={coach.id} value={coach.id}>
                    {coach.first_name} {coach.last_name} ({coach.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Trainee email"
              value={newTraineeEmail}
              onChange={(e) => setNewTraineeEmail(e.target.value)}
            />
            
            <Button 
              onClick={handleAssignTrainee}
              disabled={assignTrainee.isPending || !selectedCoach || !newTraineeEmail.trim()}
            >
              {assignTrainee.isPending ? 'Assigning...' : 'Assign Trainee'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Users & Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Current Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={user.role}
                        onValueChange={(newRole: UserRole) => updateUserRole.mutate({ userId: user.id, newRole })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="coach">Coach</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Coach-Trainee Relationships */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Coach-Trainee Relationships
          </CardTitle>
        </CardHeader>
        <CardContent>
          {coachTrainees && coachTrainees.length > 0 ? (
            <div className="space-y-4">
              {coaches.map((coach) => {
                const coachRelationships = coachTrainees.filter(ct => ct.coach_id === coach.id);
                
                if (coachRelationships.length === 0) return null;
                
                return (
                  <div key={coach.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Coach: {coach.first_name} {coach.last_name}
                    </h4>
                    <div className="space-y-2">
                      {coachRelationships.map((relationship) => (
                        <div key={relationship.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">
                            {relationship.trainee_profile.first_name} {relationship.trainee_profile.last_name} 
                            ({relationship.trainee_profile.email})
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeTrainee.mutate(relationship.id)}
                            disabled={removeTrainee.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No coach-trainee relationships found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachesTab;
