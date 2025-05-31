
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Trash2, 
  Download, 
  Settings,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";
import AIChatMessage from "./AIChatMessage";
import ConversationStarters from "./ConversationStarters";
import ChatInput from "./ChatInput";
import { cn } from "@/lib/utils";

const AIChatInterface = () => {
  const [showSettings, setShowSettings] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    sendMessage,
    regenerateLastMessage,
    clearConversation,
    cancelRequest,
  } = useAIChat({
    systemPrompt: "You are FitGenius AI, a knowledgeable and supportive fitness assistant. Provide helpful, accurate advice about fitness, nutrition, and health. Keep responses concise but informative. Always encourage users and remind them to consult healthcare professionals for medical concerns.",
    maxMessages: 100,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    console.log('Message feedback:', { messageId, feedback });
    // Here you could send feedback to your analytics service
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitgenius-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 border-0 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                FitGenius AI
                <Sparkles className="h-4 w-4 text-yellow-300" />
              </CardTitle>
              <p className="text-blue-100 text-sm">
                Your personal fitness & nutrition assistant
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasMessages && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportConversation}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearConversation}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/20 p-2"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {hasMessages && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/20 text-xs">
              {messages.length} messages
            </Badge>
            {isLoading && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-100 border-yellow-300/20 text-xs animate-pulse">
                AI Responding...
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {!hasMessages ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Welcome to FitGenius AI
                </h3>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  I'm here to help you with personalized fitness advice, nutrition guidance, 
                  and wellness tips. What would you like to know?
                </p>
              </div>
              
              <ConversationStarters 
                onStarterClick={sendMessage}
                className="w-full max-w-2xl"
              />
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((message) => (
                <AIChatMessage
                  key={message.id}
                  message={message}
                  onRegenerate={message.role === 'assistant' ? regenerateLastMessage : undefined}
                  onFeedback={handleFeedback}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <ChatInput
          onSendMessage={sendMessage}
          disabled={false}
          isLoading={isLoading}
          onCancel={cancelRequest}
          placeholder="Ask me anything about fitness, nutrition, or health..."
          className="border-t border-gray-200 bg-white"
        />
      </CardContent>
    </div>
  );
};

export default AIChatInterface;
