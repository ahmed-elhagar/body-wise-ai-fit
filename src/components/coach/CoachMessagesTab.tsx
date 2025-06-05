
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, ArrowLeft, Send, Circle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CoachTraineeChat } from "./CoachTraineeChat";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserOnlineStatus } from "@/hooks/useUserOnlineStatus";
import { useUnreadMessagesByTrainee } from "@/hooks/useUnreadMessages";

interface CoachMessagesTabProps {
  trainees: any[];
}

export const CoachMessagesTab = ({ trainees }: CoachMessagesTabProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedTrainee, setSelectedTrainee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get online status for all trainees
  const traineeIds = trainees.map(t => t.trainee_id);
  const { isUserOnline, getUserLastSeen } = useUserOnlineStatus(traineeIds);
  
  // Get unread message counts
  const { data: unreadCounts = {} } = useUnreadMessagesByTrainee();

  // Get last messages for each trainee
  const { data: lastMessages = {} } = useQuery({
    queryKey: ['last-messages', user?.id, traineeIds],
    queryFn: async () => {
      if (!user?.id || traineeIds.length === 0) return {};

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .select('trainee_id, message, created_at, sender_type')
        .eq('coach_id', user.id)
        .in('trainee_id', traineeIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching last messages:', error);
        return {};
      }

      // Group by trainee_id and get the latest message for each
      const lastMessageMap: Record<string, any> = {};
      data.forEach(msg => {
        if (!lastMessageMap[msg.trainee_id]) {
          lastMessageMap[msg.trainee_id] = msg;
        }
      });

      return lastMessageMap;
    },
    enabled: !!user?.id && traineeIds.length > 0,
  });

  // Filter trainees based on search
  const filteredTrainees = trainees.filter(trainee =>
    `${trainee.trainee_profile?.first_name || ''} ${trainee.trainee_profile?.last_name || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    trainee.trainee_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (selectedTrainee) {
    return (
      <CoachTraineeChat
        traineeId={selectedTrainee.trainee_id}
        traineeName={`${selectedTrainee.trainee_profile?.first_name || 'Unknown'} ${selectedTrainee.trainee_profile?.last_name || 'User'}`}
        onBack={() => setSelectedTrainee(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t('Messages & Communications')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('Search trainees...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTrainees.length > 0 ? (
            <div className="space-y-3">
              {filteredTrainees.map((trainee) => {
                const isOnline = isUserOnline(trainee.trainee_id);
                const lastSeen = getUserLastSeen(trainee.trainee_id);
                const unreadCount = unreadCounts[trainee.trainee_id] || 0;
                const lastMessage = lastMessages[trainee.trainee_id];
                
                return (
                  <div
                    key={trainee.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTrainee(trainee)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {(trainee.trainee_profile?.first_name?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                          isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}>
                          <Circle className="w-2 h-2 fill-current" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {trainee.trainee_profile?.first_name || 'Unknown'} {trainee.trainee_profile?.last_name || 'User'}
                        </h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600">
                            {trainee.trainee_profile?.email || 'No email available'}
                          </p>
                          <span className="text-xs text-gray-400">•</span>
                          <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                            {isOnline ? 'Online' : formatLastSeen(lastSeen)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-600 max-w-48 truncate">
                          {lastMessage ? (
                            <>
                              <span className="font-medium">
                                {lastMessage.sender_type === 'coach' ? 'You: ' : ''}
                              </span>
                              {lastMessage.message}
                            </>
                          ) : (
                            'No messages yet'
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {lastMessage ? formatLastSeen(lastMessage.created_at) : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {t('Open Chat')}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? t('No trainees found') : t('No conversations yet')}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? t('Try adjusting your search terms')
                  : t('Start by adding trainees to begin conversations')
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
