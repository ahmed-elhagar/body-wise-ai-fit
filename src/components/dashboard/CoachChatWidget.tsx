import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Users } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useChat } from "@/hooks/useChat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CoachChatWidget = () => {
  const { t } = useI18n();
  const { coach, trainees } = useCoachSystem();
  const { messages, sendMessage } = useChat();
  const [selectedTraineeId, setSelectedTraineeId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (trainees && trainees.length > 0) {
      setSelectedTraineeId(trainees[0].trainee_id);
    }
  }, [trainees]);

  const handleSendMessage = async () => {
    if (!selectedTraineeId || !messageText.trim()) return;

    try {
      await sendMessage({
        senderId: coach?.id,
        receiverId: selectedTraineeId,
        messageText: messageText.trim(),
      });
      setMessageText("");
    } catch (error: any) {
      toast.error(t('chat.sendMessageError') || 'Failed to send message.');
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.sender_id === coach?.id && msg.receiver_id === selectedTraineeId) ||
      (msg.sender_id === selectedTraineeId && msg.receiver_id === coach?.id)
  );

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          {t('Coach Chat')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              {t('Trainees')}
            </h4>
            <div className="space-y-2">
              {trainees?.map((trainee) => (
                <Button
                  key={trainee.trainee_id}
                  variant={selectedTraineeId === trainee.trainee_id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedTraineeId(trainee.trainee_id)}
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback>{trainee.trainee_profile?.first_name?.[0]}{trainee.trainee_profile?.last_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span>{trainee.trainee_profile?.first_name} {trainee.trainee_profile?.last_name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          <div className="w-2/3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              {t('Chat')}
            </h4>
            <div className="h-64 border rounded-md p-2 overflow-y-auto">
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender_id === coach?.id ? 'items-end' : 'items-start'
                        }`}
                    >
                      <div
                        className={`px-3 py-2 rounded-md ${msg.sender_id === coach?.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {msg.message_text}
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {msg.sender_id === coach?.id ? t('You') : trainees?.find(t => t.trainee_id === msg.sender_id)?.trainee_profile?.first_name}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="flex items-center mt-2">
              <Input
                type="text"
                placeholder={t('Type your message...')}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="mr-2"
              />
              <Button onClick={handleSendMessage}>
                <Send className="w-4 h-4 mr-2" />
                {t('Send')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachChatWidget;
