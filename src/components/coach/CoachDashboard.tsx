
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, TrendingUp, Calendar } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { TraineeCard } from "./TraineeCard";
import { AssignTraineeDialog } from "./AssignTraineeDialog";
import CoachChat from "./CoachChat";

const CoachDashboard = () => {
  const { t } = useI18n();
  const { trainees, totalUnreadMessages } = useCoachSystem();
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Coach Dashboard')}</h1>
          <p className="text-gray-600">{t('Manage your trainees and track their progress')}</p>
        </div>
        <Button onClick={() => setShowAssignDialog(true)}>
          <Users className="w-4 h-4 mr-2" />
          {t('Assign Trainee')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Total Trainees')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainees?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Unread Messages')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnreadMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Active Programs')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('This Week')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Trainees Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('Your Trainees')}</h2>
          <div className="space-y-4">
            {trainees?.map((trainee) => (
              <TraineeCard key={trainee.id} trainee={trainee} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">{t('Recent Activity')}</h2>
          <CoachChat />
        </div>
      </div>

      {/* Assign Trainee Dialog */}
      <AssignTraineeDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
      />
    </div>
  );
};

export default CoachDashboard;
