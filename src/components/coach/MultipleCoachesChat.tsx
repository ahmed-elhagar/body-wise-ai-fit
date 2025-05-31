
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <Card className="max-w-5xl mx-auto bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 -ml-1">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold mb-1 text-white">
                    Your Personal Coaches
                  </CardTitle>
                  <p className="text-green-100 text-sm">
                    {coaches.length === 1 
                      ? '1 dedicated coach ready to guide your journey'
                      : `${coaches.length} dedicated coaches ready to guide your journey`
                    }
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1 text-sm">
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
                  className="group relative overflow-hidden rounded-xl bg-white border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => setSelectedCoach(coach)}
                >
                  <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  
                  <div className="relative p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        <div className="relative">
                          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                            <span className="text-white font-bold text-xl">
                              {coachInitials}
                            </span>
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white"></div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                              {coachName}
                            </h3>
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          </div>
                          
                          <div className="flex items-center gap-4 text-gray-600 mb-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">Assigned {new Date(coach.assigned_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>Available now</span>
                            </div>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs px-2 py-1 animate-pulse bg-red-500 text-white">
                                {unreadCount} new messages
                              </Badge>
                            )}
                          </div>
                          
                          {coach.notes && (
                            <div className="bg-gray-50 rounded-lg p-3 mt-3 border border-gray-100">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold text-gray-900">Coach Notes:</span> {coach.notes}
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
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-md text-sm"
                          size="lg"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Start Conversation
                        </Button>
                        
                        <div className="text-xs text-gray-500 text-right">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
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
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Coaches Available</h3>
              <p className="text-gray-600 max-w-md mx-auto text-sm">You don't have any coaches assigned yet. Contact support to get paired with a qualified fitness coach.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
