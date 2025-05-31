
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowRight, UserCheck, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useUnreadMessagesFromCoach } from "@/hooks/useUnreadMessages";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { TraineeCoachChat } from "@/components/coach/TraineeCoachChat";
import { useRole } from "@/hooks/useRole";

const CoachChatWidget = () => {
  const { t } = useLanguage();
  const { coachInfo, isLoadingCoachInfo, coachInfoError } = useCoachSystem();
  const { data: unreadCount = 0 } = useUnreadMessagesFromCoach();
  const { isCoach } = useRole();
  const [showChat, setShowChat] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  console.log('CoachChatWidget - coachInfo:', coachInfo, 'loading:', isLoadingCoachInfo, 'error:', coachInfoError);

  // Don't show for coaches
  if (isCoach) {
    return null;
  }

  // Show loading state
  if (isLoadingCoachInfo) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCheck className="h-5 w-5 text-green-600" />
            {t('Your Coach')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state with retry option
  if (coachInfoError) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
            {t('Coach Info Error')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-600 text-sm mb-4">
              {retryCount > 2 
                ? t('Unable to connect to coach system. Please check your internet connection.')
                : t('Failed to load coach information')
              }
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => {
                  setRetryCount(prev => prev + 1);
                  window.location.reload();
                }} 
                variant="outline" 
                size="sm"
                disabled={retryCount > 3}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('Retry')} {retryCount > 0 && `(${retryCount})`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't show if no coach assigned
  if (!coachInfo) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCheck className="h-5 w-5 text-gray-400" />
            {t('Your Coach')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">
              {t('No coach assigned yet')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showChat) {
    return (
      <TraineeCoachChat
        coachId={coachInfo.coach_id}
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
                  {t('Assigned')} {new Date(coachInfo.assigned_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} {t('new')}
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
                <strong>{t('Coach Notes')}:</strong> {coachInfo.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachChatWidget;
