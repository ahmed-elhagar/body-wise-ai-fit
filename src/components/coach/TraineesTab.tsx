
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Target, UserPlus, ArrowLeft, AlertCircle } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useState } from "react";
import { AssignTraineeDialog } from "./AssignTraineeDialog";
import { CoachTraineeChat } from "./CoachTraineeChat";
import { TraineeProgressView } from "./TraineeProgressView";
import { useUnreadMessagesByTrainee } from "@/hooks/useUnreadMessages";
import { toast } from "sonner";

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
  const { data: unreadCounts = {} } = useUnreadMessagesByTrainee();

  console.log('TraineesTab render - trainees:', trainees?.length || 0, 'viewMode:', viewMode);

  const handleChatClick = (trainee: any) => {
    console.log('Chat clicked for trainee:', trainee.trainee_id, 'Full trainee object:', trainee);
    
    // Validate trainee data before opening chat
    if (!trainee.trainee_id || !trainee.trainee_profile) {
      console.error('Invalid trainee data:', trainee);
      toast.error('Error: Invalid trainee data. Please refresh and try again.');
      return;
    }

    setSelectedTrainee(trainee);
    setViewMode('chat');
    onChatClick(trainee.trainee_id);
  };

  const handleProgressClick = (trainee: any) => {
    console.log('Progress clicked for trainee:', trainee.trainee_id);
    
    // Validate trainee data before opening progress view
    if (!trainee.trainee_id || !trainee.trainee_profile) {
      console.error('Invalid trainee data:', trainee);
      toast.error('Error: Invalid trainee data. Please refresh and try again.');
      return;
    }

    setSelectedTrainee(trainee);
    setViewMode('progress');
  };

  const handleBackToList = () => {
    console.log('Back to list clicked');
    setViewMode('list');
    setSelectedTrainee(null);
  };

  // Show chat view
  if (viewMode === 'chat' && selectedTrainee) {
    // Double-check trainee data is still valid
    if (!selectedTrainee.trainee_id || !selectedTrainee.trainee_profile) {
      console.error('Selected trainee data became invalid:', selectedTrainee);
      toast.error('Error: Trainee data is invalid. Returning to list.');
      handleBackToList();
      return null;
    }

    return (
      <CoachTraineeChat
        traineeId={selectedTrainee.trainee_id}
        traineeName={`${selectedTrainee.trainee_profile?.first_name || 'Unknown'} ${selectedTrainee.trainee_profile?.last_name || 'User'}`}
        onBack={handleBackToList}
      />
    );
  }

  // Show progress view
  if (viewMode === 'progress' && selectedTrainee) {
    // Double-check trainee data is still valid
    if (!selectedTrainee.trainee_id || !selectedTrainee.trainee_profile) {
      console.error('Selected trainee data became invalid:', selectedTrainee);
      toast.error('Error: Trainee data is invalid. Returning to list.');
      handleBackToList();
      return null;
    }

    return (
      <TraineeProgressView
        traineeId={selectedTrainee.trainee_id}
        traineeName={`${selectedTrainee.trainee_profile?.first_name || 'Unknown'} ${selectedTrainee.trainee_profile?.last_name || 'User'}`}
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
              {trainees.map((trainee: any) => {
                // Validate each trainee before rendering
                if (!trainee.trainee_id || !trainee.trainee_profile) {
                  console.warn('Skipping invalid trainee:', trainee);
                  return (
                    <div key={trainee.id || Math.random()} className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-700">Invalid trainee data - please contact support</span>
                      </div>
                    </div>
                  );
                }

                console.log('Rendering valid trainee:', trainee.id, trainee.trainee_profile?.first_name);
                const unreadCount = unreadCounts[trainee.trainee_id] || 0;
                
                return (
                  <div key={trainee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">
                        {trainee.trainee_profile?.first_name || 'Unknown'} {trainee.trainee_profile?.last_name || 'User'}
                      </h3>
                      <p className="text-sm text-gray-600">{trainee.trainee_profile?.email || 'No email'}</p>
                      <Badge variant="outline" className="mt-1">
                        {trainee.trainee_profile?.fitness_goal || t("General Fitness")}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChatClick(trainee)}
                        className="relative"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {t("Chat")}
                        {unreadCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
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
                );
              })}
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
