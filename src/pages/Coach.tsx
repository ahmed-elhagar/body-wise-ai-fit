
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Calendar,
  UtensilsCrossed,
  Dumbbell,
  Search,
  Trash2
} from "lucide-react";
import { useCoach } from "@/hooks/useCoach";
import { useRole } from "@/hooks/useRole";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const Coach = () => {
  const { isCoach } = useRole();
  const { trainees, assignTrainee, removeTrainee, updateNotes, isAssigning, isRemoving } = useCoach();
  const [newTraineeEmail, setNewTraineeEmail] = useState("");
  const [selectedTrainee, setSelectedTrainee] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  if (!isCoach) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAssignTrainee = () => {
    if (!newTraineeEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    assignTrainee({ traineeEmail: newTraineeEmail.trim() });
    setNewTraineeEmail("");
  };

  const handleUpdateNotes = (traineeId: string) => {
    updateNotes({ traineeId, notes });
    setSelectedTrainee(null);
    setNotes("");
  };

  const openTraineePlans = (traineeId: string, traineeName: string) => {
    // Store trainee context for impersonation
    sessionStorage.setItem('impersonating_trainee', JSON.stringify({
      id: traineeId,
      name: traineeName
    }));
    
    // Navigate to meal plan with impersonation
    window.open(`/meal-plan?trainee=${traineeId}`, '_blank');
  };

  return (
    <ProtectedRoute requireProfile>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Coach Dashboard</h1>
              <Badge className="bg-blue-100 text-blue-800">Coach</Badge>
            </div>
            <p className="text-gray-600">Manage your trainees and monitor their progress</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Trainee Section */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Add New Trainee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter trainee's email"
                    value={newTraineeEmail}
                    onChange={(e) => setNewTraineeEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAssignTrainee()}
                  />
                </div>
                <Button 
                  onClick={handleAssignTrainee}
                  disabled={isAssigning || !newTraineeEmail.trim()}
                  className="w-full"
                >
                  {isAssigning ? 'Adding...' : 'Add Trainee'}
                </Button>
              </CardContent>
            </Card>

            {/* Trainees List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  My Trainees ({trainees?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!trainees || trainees.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No trainees assigned yet</p>
                    <p className="text-sm">Add trainees using their email address</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trainees.map((trainee) => (
                      <div key={trainee.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {trainee.trainee_profile.first_name} {trainee.trainee_profile.last_name}
                                </h3>
                                <p className="text-sm text-gray-600">{trainee.trainee_profile.email}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openTraineePlans(trainee.trainee_id, `${trainee.trainee_profile.first_name} ${trainee.trainee_profile.last_name}`)}
                                className="flex items-center gap-1"
                              >
                                <UtensilsCrossed className="w-4 h-4" />
                                Meal Plans
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  sessionStorage.setItem('impersonating_trainee', JSON.stringify({
                                    id: trainee.trainee_id,
                                    name: `${trainee.trainee_profile.first_name} ${trainee.trainee_profile.last_name}`
                                  }));
                                  window.open(`/exercise?trainee=${trainee.trainee_id}`, '_blank');
                                }}
                                className="flex items-center gap-1"
                              >
                                <Dumbbell className="w-4 h-4" />
                                Workouts
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTrainee(trainee.trainee_id);
                                  setNotes(trainee.notes || '');
                                }}
                                className="flex items-center gap-1"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Notes
                              </Button>
                            </div>

                            {trainee.notes && (
                              <div className="bg-gray-50 p-3 rounded text-sm">
                                <strong>Notes:</strong> {trainee.notes}
                              </div>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeTrainee(trainee.trainee_id)}
                            disabled={isRemoving}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notes Modal */}
          {selectedTrainee && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Update Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Add notes about this trainee..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdateNotes(selectedTrainee)}
                      className="flex-1"
                    >
                      Save Notes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedTrainee(null);
                        setNotes("");
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Coach;
