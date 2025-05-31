
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Target } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface TraineesTabProps {
  trainees: any[];
  onChatClick: (traineeId: string) => void;
}

export const TraineesTab = ({ trainees, onChatClick }: TraineesTabProps) => {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t("Trainees")} {t("Management")}
        </CardTitle>
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
                    {t("General Fitness")}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChatClick(trainee.trainee_id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {t("Chat")}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Target className="h-4 w-4 mr-1" />
                    {t("Progress")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("No clients yet")}</h3>
            <p className="text-gray-600">{t("Clients will appear here when they're assigned to you.")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
