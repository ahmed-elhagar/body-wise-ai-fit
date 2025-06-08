
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Search } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface CoachMessagesTabProps {
  trainees: any[];
}

export const CoachMessagesTab = ({ trainees }: CoachMessagesTabProps) => {
  const { t, isRTL } = useI18n();
  const [selectedTrainee, setSelectedTrainee] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (message.trim() && selectedTrainee) {
      console.log(`Sending message to ${selectedTrainee}:`, message);
      setMessage("");
    }
  };

  const filteredTrainees = trainees.filter(trainee => 
    trainee.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Trainees List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {t('coach:conversations') || 'Conversations'}
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t('coach:searchTrainees') || 'Search trainees...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            {filteredTrainees.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {t('coach:noTrainees') || 'No trainees found'}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredTrainees.map((trainee: any, index: number) => (
                  <Button
                    key={index}
                    variant={selectedTrainee === trainee.id ? "secondary" : "ghost"}
                    className="w-full justify-start p-4 h-auto"
                    onClick={() => setSelectedTrainee(trainee.id || `trainee-${index}`)}
                  >
                    <div className={`text-left ${isRTL ? 'text-right' : ''}`}>
                      <div className="font-medium">{trainee.name || `Trainee ${index + 1}`}</div>
                      <div className="text-sm text-gray-500">{t('coach:lastActive') || 'Last active'}: {t('common:today') || 'Today'}</div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedTrainee 
              ? `${t('coach:chatWith') || 'Chat with'} ${trainees.find(t => t.id === selectedTrainee)?.name || 'Trainee'}`
              : t('coach:selectTrainee') || 'Select a trainee to start chatting'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTrainee ? (
            <div className="space-y-4">
              <ScrollArea className="h-[300px] border rounded-lg p-4">
                <div className="space-y-4">
                  <div className="text-center text-gray-500 text-sm">
                    {t('coach:conversationStart') || 'Conversation started'}
                  </div>
                  {/* Placeholder for messages */}
                  <div className={`bg-blue-100 p-3 rounded-lg max-w-xs ${isRTL ? 'mr-auto text-right' : 'ml-auto text-left'}`}>
                    <p className="text-sm">{t('coach:sampleMessage') || 'How are you feeling about your progress this week?'}</p>
                    <span className="text-xs text-gray-500">{t('common:justNow') || 'Just now'}</span>
                  </div>
                </div>
              </ScrollArea>
              
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Input
                  placeholder={t('coach:typeMessage') || 'Type your message...'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{t('coach:selectTraineeToChat') || 'Select a trainee to start a conversation'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
