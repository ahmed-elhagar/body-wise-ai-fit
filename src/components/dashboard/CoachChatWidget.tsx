
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowRight, UserCheck } from "lucide-react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { TraineeCoachChat } from "@/components/coach/TraineeCoachChat";

const CoachChatWidget = () => {
  const { t } = useLanguage();
  const { coachInfo, isCoach } = useCoachSystem();
  const { data: unreadCount = 0 } = useUnreadMessages();
  const [showChat, setShowChat] = useState(false);

  // Don't show for coaches or if no coach assigned
  if (isCoach || !coachInfo) {
    return null;
  }

  if (showChat) {
    return (
      <TraineeCoachChat
        coachId={coachInfo.coach_profile?.id || ''}
        coachName={`${coachInfo.coach_profile?.first_name || 'Unknown'} ${coachInfo.coach_profile?.last_name || 'Coach'}`}
        onBack={() => setShowChat(false)}
      />
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCheck className="h-5 w-5 text-green-600" />
            {t('Your Coach')}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChat(true)}
            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            {t('Chat')}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700 font-semibold text-sm">
                  {coachInfo.coach_profile?.first_name?.[0]}{coachInfo.coach_profile?.last_name?.[0]}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-green-800">
                  {coachInfo.coach_profile?.first_name || 'Unknown'} {coachInfo.coach_profile?.last_name || 'Coach'}
                </h4>
                <p className="text-sm text-green-600">
                  Assigned {new Date(coachInfo.assigned_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(true)}
                className="text-green-700 hover:text-green-800 hover:bg-green-100"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {coachInfo.notes && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-600">
                <strong>Coach Notes:</strong> {coachInfo.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachChatWidget;
