
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowRight, UserCheck, Loader2, AlertCircle, RefreshCw, Users } from "lucide-react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { MultipleCoachesChat } from "@/components/coach/MultipleCoachesChat";
import { useRole } from "@/hooks/useRole";
import type { CoachInfo } from "@/hooks/coach/types";

const CoachChatWidget = () => {
  const { t } = useLanguage();
  const { coaches, totalUnreadMessages, unreadMessagesByCoach, isLoadingCoachInfo, coachInfoError } = useCoachSystem();
  const { isCoach } = useRole();
  const [showChat, setShowChat] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  console.log('CoachChatWidget - coaches:', coaches.length, 'loading:', isLoadingCoachInfo, 'error:', coachInfoError);

  // Helper function to get coach display name
  const getCoachDisplayName = (coach: CoachInfo) => {
    if (coach.coach_profile?.first_name || coach.coach_profile?.last_name) {
      const firstName = coach.coach_profile.first_name || '';
      const lastName = coach.coach_profile.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    return 'Coach'; // Fallback instead of "Unknown Coach"
  };

  // Helper function to get coach initials
  const getCoachInitials = (coach: CoachInfo) => {
    const firstName = coach.coach_profile?.first_name;
    const lastName = coach.coach_profile?.last_name;
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (lastName) {
      return lastName[0].toUpperCase();
    }
    return 'C'; // Fallback to 'C' for Coach
  };

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
            {t('Your Coaches')}
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

  // Don't show if no coaches assigned
  if (coaches.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCheck className="h-5 w-5 text-gray-400" />
            {t('Your Coaches')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">
              {t('No coaches assigned yet')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showChat) {
    return (
      <MultipleCoachesChat
        coaches={coaches}
        unreadMessagesByCoach={unreadMessagesByCoach}
        onBack={() => setShowChat(false)}
      />
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-green-600" />
            {t('Your Coaches')} ({coaches.length})
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
          {coaches.slice(0, 2).map((coach) => {
            const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
            const coachName = getCoachDisplayName(coach);
            const coachInitials = getCoachInitials(coach);
            
            return (
              <div 
                key={coach.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
                onClick={() => setShowChat(true)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-semibold text-sm">
                      {coachInitials}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800">
                      {coachName}
                    </h4>
                    <p className="text-xs text-green-600">
                      {t('Assigned')} {new Date(coach.assigned_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowChat(true);
                    }}
                    className="text-green-700 hover:text-green-800 hover:bg-green-100"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          {coaches.length > 2 && (
            <div className="text-center py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(true)}
                className="text-green-600 hover:text-green-700"
              >
                {t('View {{count}} more coaches', { count: coaches.length - 2 })}
              </Button>
            </div>
          )}
          
          {coaches.length > 0 && coaches[0].notes && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-600">
                <strong>{t('Latest Coach Notes')}:</strong> {coaches[0].notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachChatWidget;
