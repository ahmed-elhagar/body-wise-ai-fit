import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, MessageSquare } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { TraineesTab } from "./TraineesTab";
import { CoachChat } from "./CoachChat";

const CoachDashboard = () => {
  const { t } = useI18n();
  const { trainees } = useCoachSystem();
  const [chatView, setChatView] = useState<"all" | string>("all");

  const handleChatClick = (traineeId: string) => {
    setChatView(traineeId);
  };

  const handleBackToList = () => {
    setChatView("all");
  };

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {chatView === "all" ? (
            <TraineesTab trainees={trainees} onChatClick={handleChatClick} />
          ) : (
            <CoachChat traineeId={chatView} onBack={handleBackToList} />
          )}
        </div>

        {/* Sidebar / Additional Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t("Coach")} {t("Dashboard")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {t("Welcome to your coach dashboard. Manage your trainees and track their progress.")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {t("Quick Actions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                {t("View All Trainees")}
              </Button>
              <Button variant="outline" className="w-full">
                {t("Send a Message")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;
