
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowRight, UserCheck, Loader2, AlertCircle, RefreshCw, Users, Calendar, Star } from "lucide-react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { CoachTraineeChat } from "./CoachTraineeChat";
import { useRole } from "@/hooks/useRole";
import { useNavigate } from "react-router-dom";
import type { CoachInfo } from "@/hooks/coach/types";

const CoachChatWidget = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { coaches, totalUnreadMessages, unreadMessagesByCoach, isLoadingCoachInfo, coachInfoError } = useCoachSystem();
  const { isCoach } = useRole();
  const [selectedCoach, setSelectedCoach] = useState<CoachInfo | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  console.log('CoachChatWidget - coaches:', coaches.length, 'loading:', isLoadingCoachInfo, 'error:', coachInfoError);

  // Helper function to get coach display name
  const getCoachDisplayName = (coach: CoachInfo) => {
    if (coach.coach_profile?.first_name || coach.coach_profile?.last_name) {
      const firstName = coach.coach_profile.first_name || '';
      const lastName = coach.coach_profile.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    return coach.coach_profile?.email || 'Your Coach';
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
    return 'C';
  };

  // Don't show for coaches
  if (isCoach) {
    return null;
  }

  // Show selected coach chat directly
  if (selectedCoach) {
    return (
      <CoachTraineeChat
        traineeId={selectedCoach.coach_id}
        traineeName={getCoachDisplayName(selectedCoach)}
        onBack={() => setSelectedCoach(null)}
      />
    );
  }

  // Show loading state
  if (isLoadingCoachInfo) {
    return (
      <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-green-600" />
            </div>
            Your Coaches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-green-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600 text-sm">Finding your coaches...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state with retry option
  if (coachInfoError) {
    return (
      <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-red-600">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
            Coach Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-red-600 text-xs mb-4">
              {retryCount > 2 
                ? 'Unable to connect to coaching system. Please check your connection.'
                : 'Failed to load coach information'
              }
            </p>
            <Button 
              onClick={() => {
                setRetryCount(prev => prev + 1);
                window.location.reload();
              }} 
              variant="outline" 
              size="sm"
              disabled={retryCount > 3}
              className="border-green-200 hover:bg-green-50 text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Try Again {retryCount > 0 && `(${retryCount})`}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't show if no coaches assigned
  if (coaches.length === 0) {
    return null; // Hide widget completely when no coaches
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            Your Coaches ({coaches.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/chat')}
            className="text-white hover:bg-white/20 px-3 py-1 text-xs"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            View All
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {coaches.slice(0, 2).map((coach) => {
            const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
            const coachName = getCoachDisplayName(coach);
            const coachInitials = getCoachInitials(coach);
            
            return (
              <div 
                key={coach.id} 
                className="group flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedCoach(coach)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-sm">
                        {coachInitials}
                      </span>
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <h4 className="font-bold text-gray-900 group-hover:text-green-700 text-sm">
                        {coachName}
                      </h4>
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>Assigned {new Date(coach.assigned_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs animate-pulse bg-red-500 text-white px-1.5 py-0.5">
                      {unreadCount}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCoach(coach);
                    }}
                    className="text-green-700 hover:text-green-800 hover:bg-green-100 p-1"
                  >
                    <MessageCircle className="w-3 h-3" />
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
                onClick={() => navigate('/chat')}
                className="text-green-600 hover:text-green-700 hover:bg-green-50 text-xs"
              >
                View {coaches.length - 2} more coaches →
              </Button>
            </div>
          )}
          
          {coaches.length > 0 && coaches[0].notes && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-700">
                <strong className="text-blue-800">Latest Coach Notes:</strong> {coaches[0].notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachChatWidget;
