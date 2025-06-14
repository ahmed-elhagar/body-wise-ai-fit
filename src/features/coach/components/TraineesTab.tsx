
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Grid, List, Plus, Settings } from "lucide-react";
import TraineeProgressCard from "./TraineeProgressCard";
import TraineeFilterBar from "./TraineeFilterBar";
import CoachMetricsOverview from "./CoachMetricsOverview";
import CoachTasksPanel from "./CoachTasksPanel";
import { AssignTraineeDialog } from "./AssignTraineeDialog";
import { CoachTraineeChat } from "./CoachTraineeChat";
import { TraineeProgressView } from "./TraineeProgressView";

interface TraineesTabProps {
  trainees: any[];
  onChatClick: (traineeId: string) => void;
}

type ViewMode = 'list' | 'chat' | 'progress';
type ViewType = 'grid' | 'list';

export const TraineesTab = ({ trainees, onChatClick }: TraineesTabProps) => {
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [selectedTrainee, setSelectedTrainee] = useState<any>(null);
  const [filteredTrainees, setFilteredTrainees] = useState(trainees);

  const handleChatClick = (trainee: any) => {
    const traineeId = trainee.trainee_id || trainee.id;
    setSelectedTrainee({ ...trainee, trainee_id: traineeId });
    setViewMode('chat');
    onChatClick(traineeId);
  };

  const handleProgressClick = (trainee: any) => {
    const traineeId = trainee.trainee_id || trainee.id;
    setSelectedTrainee({ ...trainee, trainee_id: traineeId });
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
        traineeName={`${selectedTrainee.trainee_profile?.first_name || 'Unknown'} ${selectedTrainee.trainee_profile?.last_name || 'User'}`}
        onBack={handleBackToList}
      />
    );
  }

  // Show progress view
  if (viewMode === 'progress' && selectedTrainee) {
    return (
      <TraineeProgressView
        traineeId={selectedTrainee.trainee_id}
        traineeName={`${selectedTrainee.trainee_profile?.first_name || 'Unknown'} ${selectedTrainee.trainee_profile?.last_name || 'User'}`}
        traineeProfile={selectedTrainee.trainee_profile}
        onBack={handleBackToList}
      />
    );
  }

  // Show main trainees management view
  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <CoachMetricsOverview trainees={trainees} />
      
      {/* Tasks Panel - Full Width */}
      <CoachTasksPanel trainees={trainees} className="w-full" />
      
      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Trainees Management
              <Badge variant="secondary" className="ml-2">
                {filteredTrainees.length} of {trainees.length}
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {/* View Type Toggle */}
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={viewType === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewType === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-1" />
                Manage
              </Button>
              
              <Button size="sm" onClick={() => setShowAssignDialog(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Trainee
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Filter Bar */}
          <TraineeFilterBar
            trainees={trainees}
            onFilteredTraineesChange={setFilteredTrainees}
          />
          
          {/* Trainees Grid/List */}
          {filteredTrainees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No trainees found
              </h3>
              <p className="text-gray-600 mb-6">
                {trainees.length === 0 
                  ? "Start building your client base by adding your first trainee."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              <Button onClick={() => setShowAssignDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Trainee
              </Button>
            </div>
          ) : (
            <div className={
              viewType === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredTrainees.map((trainee: any) => (
                <TraineeProgressCard
                  key={trainee.id}
                  trainee={trainee}
                  onChatClick={() => handleChatClick(trainee)}
                  onProgressClick={() => handleProgressClick(trainee)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AssignTraineeDialog 
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
      />
    </div>
  );
};
