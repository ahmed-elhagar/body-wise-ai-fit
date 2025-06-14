
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CoachTasksPanel from "./CoachTasksPanel";
import { CreateTaskDialog } from "./CreateTaskDialog";

interface CoachTasksTabProps {
  trainees: any[];
}

const CoachTasksTab = ({ trainees }: CoachTasksTabProps) => {
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Task Management</CardTitle>
            <Button onClick={() => setShowCreateTaskDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Manage your coaching tasks, set reminders, and track progress with your trainees.
          </p>
        </CardContent>
      </Card>

      {/* Tasks Panel */}
      <CoachTasksPanel trainees={trainees} />

      {/* Create Task Dialog */}
      <CreateTaskDialog 
        open={showCreateTaskDialog}
        onOpenChange={setShowCreateTaskDialog}
        trainees={trainees}
      />
    </div>
  );
};

export default CoachTasksTab;
