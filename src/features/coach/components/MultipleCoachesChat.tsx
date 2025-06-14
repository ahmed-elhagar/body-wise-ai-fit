
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ArrowLeft, Circle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CoachTraineeChat } from "./CoachTraineeChat";
import { useUserOnlineStatus } from "../hooks/useUserOnlineStatus";
import type { CoachInfo } from "../types";

interface MultipleCoachesChatProps {
  coaches: CoachInfo[];
  unreadMessagesByCoach: Record<string, number>;
}

export const MultipleCoachesChat = ({ coaches, unreadMessagesByCoach }: MultipleCoachesChatProps) => {
  const { t } = useLanguage();
  const [selectedCoach, setSelectedCoach] = useState<CoachInfo | null>(null);

  // Get online status for all coaches
  const coachIds = coaches.map(c => c.coach_id);
  const { isUserOnline, getUserLastSeen } = useUserOnlineStatus(coachIds);

  const formatLastSeen = (lastSeen: string | undefined) => {
    if (!lastSeen) return 'Unknown';
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (selectedCoach) {
    return (
      <CoachTraineeChat
        traineeId={selectedCoach.trainee_id}
        traineeName={`${selectedCoach.coach_profile?.first_name || 'Coach'} ${selectedCoach.coach_profile?.last_name || ''}`}
        onBack={() => setSelectedCoach(null)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t('Your Coaches')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {coaches.map((coach) => {
            const isOnline = isUserOnline(coach.coach_id);
            const lastSeen = getUserLastSeen(coach.coach_id);
            const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
            
            return (
              <div
                key={coach.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedCoach(coach)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {(coach.coach_profile?.first_name?.[0] || 'C').toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                      isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      <Circle className="w-2 h-2 fill-current" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {coach.coach_profile?.first_name || 'Coach'} {coach.coach_profile?.last_name || ''}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">
                        {coach.coach_profile?.email || 'No email available'}
                      </p>
                      <span className="text-xs text-gray-400">•</span>
                      <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                        {isOnline ? 'Online' : formatLastSeen(lastSeen)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <Badge variant="destructive">
                      {unreadCount}
                    </Badge>
                  )}
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
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
