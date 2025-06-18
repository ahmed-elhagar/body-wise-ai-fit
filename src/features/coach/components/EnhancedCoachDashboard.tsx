
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoachHeader } from "./CoachHeader";
import { CoachTabs } from "./CoachTabs";
import { useCoachTrainees } from "@/features/admin/hooks/useCoachTrainees";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";

const EnhancedCoachDashboard = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const { trainees = [], isLoading, error } = useCoachTrainees();

  if (isLoading) {
    return <SimpleLoadingIndicator message="Loading coach dashboard..." />;
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <p className="text-red-600">Error loading dashboard: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <CoachHeader totalClients={trainees.length} />
      <CoachTabs 
        trainees={trainees}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
      />
    </div>
  );
};

export default EnhancedCoachDashboard;
