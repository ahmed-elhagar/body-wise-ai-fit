import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Search, Crown, Mail } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TraineeAutoComplete } from "./TraineeAutoComplete";

type UserRole = 'normal' | 'coach' | 'admin';

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

interface Coach {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  trainees: CoachTrainee[];
}

const CoachesTab = () => {
  const [selectedTraineeIds, setSelectedTraineeIds] = useState<Record<string, string>>({});
  const [traineeInputValues, setTraineeInputValues] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
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
      const { data: relationships, error: relationshipsError } = await supabase
        .from('coach_trainees')
        .select('*');

      if (relationshipsError) throw relationshipsError;

      if (!relationships || relationships.length === 0) {
        return [];
      }

      const traineeIds = relationships.map(rel => rel.trainee_id);
      const { data: traineeProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', traineeIds);

      if (profilesError) throw profilesError;

      return relationships.map(relationship => {
        const traineeProfile = traineeProfiles?.find(profile => profile.id === relationship.trainee_id);
        return {
          ...relationship,
          trainee_profile: traineeProfile || { first_name: '', last_name: '', email: '' }
        };
      }) as CoachTrainee[];
    }
  });

  const assignTrainee = useMutation({
    mutationFn: async ({ coachId, traineeId }: { coachId: string; traineeId: string }) => {
      const { data, error } = await supabase
        .from('coach_trainees')
        .insert({
          coach_id: coachId,
          trainee_id: traineeId
        });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-coach-trainees'] });
      setSelectedTraineeIds(prev => ({ ...prev, [variables.coachId]: "" }));
      setTraineeInputValues(prev => ({ ...prev, [variables.coachId]: "" }));
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
  
  // Create coaches with their trainees
  const coachesWithTrainees: Coach[] = coaches.map(coach => ({
    ...coach,
    trainees: coachTrainees?.filter(ct => ct.coach_id === coach.id) || []
  }));

  const filteredCoaches = coachesWithTrainees.filter(coach =>
    coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignTrainee = (coachId: string) => {
    const selectedTraineeId = selectedTraineeIds[coachId];
    if (!selectedTraineeId) {
      toast.error("Please select a trainee");
      return;
    }
    
    assignTrainee.mutate({ 
      coachId, 
      traineeId: selectedTraineeId
    });
  };

  const handleTraineeSelect = (coachId: string, userId: string) => {
    setSelectedTraineeIds(prev => ({ ...prev, [coachId]: userId }));
  };

  const handleTraineeInputChange = (coachId: string, value: string) => {
    setTraineeInputValues(prev => ({ ...prev, [coachId]: value }));
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Coach Management</h2>
            <p className="text-gray-600">Assign trainees to coaches and manage relationships</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Search coaches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredCoaches.map((coach) => (
          <Card key={coach.id} className="overflow-visible">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {coach.first_name} {coach.last_name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{coach.email}</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {coach.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {coach.trainees.length}
                  </div>
                  <div className="text-sm text-gray-500">
                    {coach.trainees.length === 1 ? 'Trainee' : 'Trainees'}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Assign new trainee */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg relative">
                <div className="flex items-center gap-2 mb-3">
                  <UserPlus className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-gray-700">Assign New Trainee</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <TraineeAutoComplete
                      value={traineeInputValues[coach.id] || ""}
                      onValueChange={(value) => handleTraineeInputChange(coach.id, value)}
                      onUserSelect={(userId) => handleTraineeSelect(coach.id, userId)}
                      placeholder="Enter trainee email or name..."
                      instanceId={coach.id}
                    />
                  </div>
                  <Button 
                    onClick={() => handleAssignTrainee(coach.id)}
                    disabled={assignTrainee.isPending || !selectedTraineeIds[coach.id]}
                    className="px-6"
                  >
                    {assignTrainee.isPending ? 'Assigning...' : 'Assign'}
                  </Button>
                </div>
              </div>

              {/* Current trainees */}
              {coach.trainees.length > 0 ? (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Current Trainees ({coach.trainees.length})
                  </h4>
                  <div className="space-y-2">
                    {coach.trainees.map((relationship) => (
                      <div key={relationship.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {relationship.trainee_profile.first_name} {relationship.trainee_profile.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {relationship.trainee_profile.email}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeTrainee.mutate(relationship.id)}
                          disabled={removeTrainee.isPending}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No trainees assigned to this coach</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCoaches.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Crown className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Coaches Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No coaches match your search criteria.' : 'No users with coach or admin roles found.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoachesTab;
