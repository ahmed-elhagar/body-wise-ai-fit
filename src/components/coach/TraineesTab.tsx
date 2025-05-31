
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Target, UserPlus } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useState } from "react";
import { AssignTraineeDialog } from "./AssignTraineeDialog";
import { CoachTraineeChat } from "./CoachTraineeChat";
import { TraineeProgressView } from "./TraineeProgressView";

interface TraineesTabProps {
  trainees: any[];
  onChatClick: (traineeId: string) => void;
}

type ViewMode = 'list' | 'chat' | 'progress';

export const TraineesTab = ({ trainees, onChatClick }: TraineesTabProps) => {
  const { t } = useI18n();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTrainee, setSelectedTrainee] = useState<any>(null);

  const handleChatClick = (trainee: any) => {
    setSelectedTrainee(trainee);
    setViewMode('chat');
    onChatClick(trainee.trainee_id);
  };

  const handleProgressClick = (trainee: any) => {
    setSelectedTrainee(trainee);
    setViewMode('progress');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedTrainee(null);
  };

  // Show chat view
  if (viewMode === 'chat' && selectedTrainee) {
    return (
      <CoachTraineeChat
        traineeId={selectedTrainee.trainee_id}
        traineeName={`${selectedTrainee.trainee_profile?.first_name} ${selectedTrainee.trainee_profile?.last_name}`}
        onBack={handleBackToList}
      />
    );
  }

  // Show progress view
  if (viewMode === 'progress' && selectedTrainee) {
    return (
      <TraineeProgressView
        traineeId={selectedTrainee.trainee_id}
        traineeName={`${selectedTrainee.trainee_profile?.first_name} ${selectedTrainee.trainee_profile?.last_name}`}
        traineeProfile={selectedTrainee.trainee_profile}
        onBack={handleBackToList}
      />
    );
  }

  // Show main trainees list
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t("Trainees")} {t("Management")}
            </CardTitle>
            <Button onClick={() => setShowAssignDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Trainee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {trainees && trainees.length > 0 ? (
            <div className="space-y-4">
              {trainees.map((trainee: any) => (
                <div key={trainee.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">
                      {trainee.trainee_profile?.first_name} {trainee.trainee_profile?.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{trainee.trainee_profile?.email}</p>
                    <Badge variant="outline" className="mt-1">
                      {trainee.trainee_profile?.fitness_goal || t("General Fitness")}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChatClick(trainee)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {t("Chat")}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleProgressClick(trainee)}
                    >
                      <Target className="h-4 w-4 mr-1" />
                      {t("Progress")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No clients yet</h3>
              <p className="text-gray-600 mb-6">
                Start building your client base by adding your first trainee.
              </p>
              <Button onClick={() => setShowAssignDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Your First Trainee
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AssignTraineeDialog 
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
      />
    </>
  );
};
