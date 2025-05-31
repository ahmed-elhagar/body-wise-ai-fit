
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, ArrowLeft } from "lucide-react";
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

  // Show list of coaches
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            {t('Your Coaches')} ({coaches.length})
          </CardTitle>
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {coaches.map((coach) => {
            const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
            const coachName = getCoachDisplayName(coach);
            const coachInitials = getCoachInitials(coach);
            
            return (
              <div
                key={coach.id}
                className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
                onClick={() => setSelectedCoach(coach)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-semibold">
                      {coachInitials}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">
                      {coachName}
                    </h4>
                    <p className="text-sm text-green-600">
                      {t('Assigned')} {new Date(coach.assigned_at).toLocaleDateString()}
                    </p>
                    {coach.notes && (
                      <p className="text-xs text-gray-600 mt-1 max-w-xs truncate">
                        {coach.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {unreadCount} {t('new')}
                    </Badge>
                  )}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the card click from firing
                      setSelectedCoach(coach);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t('Chat')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
