
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users, MessageSquare } from "lucide-react";
import UserSearchDropdown from "./UserSearchDropdown";
import AssignTraineeDialog from "./AssignTraineeDialog";

interface CoachesTabProps {
  coaches: any[];
  onAssignCoach: (coachId: string, traineeId: string) => void;
}

const CoachesTab = ({ coaches, onAssignCoach }: CoachesTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const filteredCoaches = coaches.filter(coach =>
    coach.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search coaches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowAssignDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Assign Coach
        </Button>
      </div>

      {/* Coaches List */}
      <div className="grid gap-4">
        {filteredCoaches.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No coaches found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "No coaches match your search criteria." : "You don't have any assigned coaches yet."}
              </p>
              <Button onClick={() => setShowAssignDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Find a Coach
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCoaches.map((coach) => (
            <Card key={coach.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{coach.name}</CardTitle>
                    <p className="text-gray-600">{coach.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={coach.isOnline ? "default" : "secondary"}>
                      {coach.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>Assigned: {new Date(coach.assignedAt).toLocaleDateString()}</p>
                    {coach.specialization && (
                      <p>Specialization: {coach.specialization}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AssignTraineeDialog
        isOpen={showAssignDialog}
        onClose={() => setShowAssignDialog(false)}
        onAssign={(data) => {
          onAssignCoach(data.traineeId, data.notes || '');
          setShowAssignDialog(false);
        }}
      />
    </div>
  );
};

export default CoachesTab;
