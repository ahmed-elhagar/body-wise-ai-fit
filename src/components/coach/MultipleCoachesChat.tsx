import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Send, Bot } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface MultipleCoachesChatProps {
  coachId: string;
}

export const MultipleCoachesChat = ({ coachId }: MultipleCoachesChatProps) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data: profile } = useUser();
  const { messages, sendMessage, isLoading } = useChat({
    receiverId: coachId,
    senderId: user?.id,
    chatType: "coach",
  });
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on initial load and when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() !== "") {
      await sendMessage({
        senderId: user?.id || '',
        receiverId: coachId,
        content: input,
        timestamp: new Date(),
        chatType: "coach",
      });
      setInput("");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>Loading chat...</CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {t("Chat with Coach")}
        </CardTitle>
        <Badge variant="secondary">
          <Users className="h-4 w-4 mr-2" />
          {t("Support")}
        </Badge>
      </CardHeader>
      <CardContent className="h-full flex flex-col p-2">
        <div className="flex-grow overflow-y-auto" ref={chatContainerRef}>
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`mb-2 flex flex-col ${
                message.senderId === user?.id ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 text-sm shadow-sm w-fit max-w-[75%] ${
                  message.senderId === user?.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.content}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <div className="relative">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("Type your message...")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <Button
              onClick={handleSend}
              className="absolute right-1 top-1 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
