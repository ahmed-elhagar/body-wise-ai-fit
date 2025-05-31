
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, ArrowLeft, Calendar, Star } from "lucide-react";
import { TraineeCoachChat } from "./TraineeCoachChat";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CoachInfo } from "@/hooks/coach/types";

interface MultipleCoachesChatProps {
  coaches: CoachInfo[];
  unreadMessagesByCoach: Record<string, number>;
  onBack?: () => void;
}

export const MultipleCoachesChat = ({ coaches, unreadMessagesByCoach, onBack }: MultipleCoachesChatProps) => {
  const { t } = useLanguage();
  const [selectedCoach, setSelectedCoach] = useState<CoachInfo | null>(null);

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

  // If a specific coach is selected, show the chat interface
  if (selectedCoach) {
    return (
      <TraineeCoachChat
        coachId={selectedCoach.coach_id}
        coachName={getCoachDisplayName(selectedCoach)}
        onBack={() => setSelectedCoach(null)}
      />
    );
  }

  // Show list of coaches with enhanced design
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen p-4">
      <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    {t('Your Coaches')}
                  </CardTitle>
                  <p className="text-green-100 text-sm">
                    {coaches.length === 1 
                      ? '1 coach assigned to guide you'
                      : `${coaches.length} coaches assigned to guide you`
                    }
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {coaches.length} {coaches.length === 1 ? 'Coach' : 'Coaches'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            {coaches.map((coach) => {
              const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
              const coachName = getCoachDisplayName(coach);
              const coachInitials = getCoachInitials(coach);
              
              return (
                <div
                  key={coach.id}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white to-green-50 border border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => setSelectedCoach(coach)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {coachInitials}
                            </span>
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                              {coachName}
                            </h3>
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-green-600" />
                              <span>{t('Assigned')} {new Date(coach.assigned_at).toLocaleDateString()}</span>
                            </div>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs px-2 py-1 animate-pulse">
                                {unreadCount} {t('new')}
                              </Badge>
                            )}
                          </div>
                          
                          {coach.notes && (
                            <div className="bg-gray-50 rounded-lg p-3 mt-3 border border-gray-100">
                              <p className="text-sm text-gray-700 line-clamp-2">
                                <span className="font-medium text-gray-900">Coach Notes:</span> {coach.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCoach(coach);
                          }}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                          size="sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {t('Start Chat')}
                        </Button>
                        
                        <div className="text-xs text-gray-500 text-right">
                          <div>Tap anywhere to chat</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {coaches.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Coaches Assigned</h3>
              <p className="text-gray-600">You don't have any coaches assigned yet. Contact support to get paired with a coach.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
