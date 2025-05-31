
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowRight, UserCheck, Loader2, AlertCircle, RefreshCw, Users, Calendar, Star } from "lucide-react";
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
    return 'Your Coach'; // Better fallback
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
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            Your Coaches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-10 w-10 text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Finding your coaches...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state with retry option
  if (coachInfoError) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-red-600">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            Coach Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 text-sm mb-6">
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
              className="border-green-200 hover:bg-green-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again {retryCount > 0 && `(${retryCount})`}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't show if no coaches assigned
  if (coaches.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-gray-400" />
            </div>
            Your Coaches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-4">
              No coaches assigned yet
            </p>
            <p className="text-xs text-gray-400">
              Contact support to get matched with a coach
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
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            Your Coaches ({coaches.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(true)}
            className="text-white hover:bg-white/20 px-4 py-2"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {coaches.slice(0, 2).map((coach) => {
            const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
            const coachName = getCoachDisplayName(coach);
            const coachInitials = getCoachInitials(coach);
            
            return (
              <div 
                key={coach.id} 
                className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setShowChat(true)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">
                        {coachInitials}
                      </span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-green-800 group-hover:text-green-700">
                        {coachName}
                      </h4>
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <Calendar className="w-3 h-3" />
                      <span>Assigned {new Date(coach.assigned_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs animate-pulse">
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
                    className="text-green-700 hover:text-green-800 hover:bg-green-100 p-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          {coaches.length > 2 && (
            <div className="text-center py-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(true)}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                View {coaches.length - 2} more coaches →
              </Button>
            </div>
          )}
          
          {coaches.length > 0 && coaches[0].notes && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-700">
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
