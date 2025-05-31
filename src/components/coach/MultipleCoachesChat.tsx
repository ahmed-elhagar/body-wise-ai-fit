
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, ArrowLeft, Calendar, Star, Clock, MessageSquare } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <Card className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 -ml-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold mb-2">
                    Your Personal Coaches
                  </CardTitle>
                  <p className="text-green-100 text-lg">
                    {coaches.length === 1 
                      ? '1 dedicated coach ready to guide your journey'
                      : `${coaches.length} dedicated coaches ready to guide your journey`
                    }
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
              {coaches.length} {coaches.length === 1 ? 'Coach' : 'Coaches'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            {coaches.map((coach) => {
              const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
              const coachName = getCoachDisplayName(coach);
              const coachInitials = getCoachInitials(coach);
              
              return (
                <div
                  key={coach.id}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-white via-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                  onClick={() => setSelectedCoach(coach)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-bold text-2xl">
                              {coachInitials}
                            </span>
                          </div>
                          <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-3xl font-bold text-green-800 group-hover:text-green-700 transition-colors">
                              {coachName}
                            </h3>
                            <Star className="w-6 h-6 text-yellow-500 fill-current" />
                          </div>
                          
                          <div className="flex items-center gap-6 text-green-600 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5" />
                              <span className="font-medium">Assigned {new Date(coach.assigned_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              <span>Available now</span>
                            </div>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-sm px-3 py-1 animate-pulse">
                                {unreadCount} new messages
                              </Badge>
                            )}
                          </div>
                          
                          {coach.notes && (
                            <div className="bg-white/80 rounded-xl p-4 mt-4 border border-green-100">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold text-green-800">Coach Notes:</span> {coach.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-4">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCoach(coach);
                          }}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-xl"
                          size="lg"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Start Conversation
                        </Button>
                        
                        <div className="text-sm text-green-600 text-right">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Click anywhere to chat</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {coaches.length === 0 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Users className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Coaches Available</h3>
              <p className="text-gray-600 max-w-md mx-auto">You don't have any coaches assigned yet. Contact support to get paired with a qualified fitness coach.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
