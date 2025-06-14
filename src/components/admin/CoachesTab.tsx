
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Users, UserPlus, Search, Crown, Mail, ChevronDown, ChevronRight } from "lucide-react";
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
  const [expandedCoaches, setExpandedCoaches] = useState<Record<string, boolean>>({});
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedCoachForAssign, setSelectedCoachForAssign] = useState<Coach | null>(null);
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
      setIsAssignDialogOpen(false);
      setSelectedCoachForAssign(null);
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

  const handleAssignTrainee = () => {
    if (!selectedCoachForAssign || !selectedTraineeIds[selectedCoachForAssign.id]) {
      toast.error("Please select a trainee");
      return;
    }
    
    assignTrainee.mutate({ 
      coachId: selectedCoachForAssign.id, 
      traineeId: selectedTraineeIds[selectedCoachForAssign.id]
    });
  };

  const handleTraineeSelect = (coachId: string, userId: string) => {
    setSelectedTraineeIds(prev => ({ ...prev, [coachId]: userId }));
  };

  const handleTraineeInputChange = (coachId: string, value: string) => {
    setTraineeInputValues(prev => ({ ...prev, [coachId]: value }));
  };

  const toggleCoachExpansion = (coachId: string) => {
    setExpandedCoaches(prev => ({ ...prev, [coachId]: !prev[coachId] }));
  };

  const openAssignDialog = (coach: Coach) => {
    setSelectedCoachForAssign(coach);
    setIsAssignDialogOpen(true);
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

      <div className="grid gap-4">
        {filteredCoaches.map((coach) => (
          <Card key={coach.id} className="overflow-visible">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {coach.first_name} {coach.last_name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-3 w-3 text-gray-500" />
                      <span className="text-sm text-gray-600">{coach.email}</span>
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        {coach.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <div className="text-lg font-bold text-purple-600">
                      {coach.trainees.length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {coach.trainees.length === 1 ? 'Trainee' : 'Trainees'}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => openAssignDialog(coach)}
                    className="text-purple-600 hover:text-purple-700 border-purple-200 hover:border-purple-300"
                    variant="outline"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Assign
                  </Button>
                  {coach.trainees.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleCoachExpansion(coach.id)}
                      className="p-1"
                    >
                      {expandedCoaches[coach.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            {coach.trainees.length > 0 && (
              <Collapsible open={expandedCoaches[coach.id]} onOpenChange={() => toggleCoachExpansion(coach.id)}>
                <CollapsibleContent>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      {coach.trainees.map((relationship) => (
                        <div key={relationship.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="h-3 w-3 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-gray-900">
                                {relationship.trainee_profile.first_name} {relationship.trainee_profile.last_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {relationship.trainee_profile.email}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeTrainee.mutate(relationship.id)}
                            disabled={removeTrainee.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2 py-1 h-6"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            )}
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

      {/* Assign Trainee Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Trainee to {selectedCoachForAssign?.first_name} {selectedCoachForAssign?.last_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <TraineeAutoComplete
                value={traineeInputValues[selectedCoachForAssign?.id || ""] || ""}
                onValueChange={(value) => selectedCoachForAssign && handleTraineeInputChange(selectedCoachForAssign.id, value)}
                onUserSelect={(userId) => selectedCoachForAssign && handleTraineeSelect(selectedCoachForAssign.id, userId)}
                placeholder="Enter trainee email or name..."
                instanceId={selectedCoachForAssign?.id || "assign-dialog"}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAssignTrainee}
                disabled={assignTrainee.isPending || !selectedCoachForAssign || !selectedTraineeIds[selectedCoachForAssign?.id || ""]}
                className="flex-1"
              >
                {assignTrainee.isPending ? 'Assigning...' : 'Assign Trainee'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAssignDialogOpen(false);
                  setSelectedCoachForAssign(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoachesTab;
