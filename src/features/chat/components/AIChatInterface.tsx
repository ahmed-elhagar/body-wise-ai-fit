
import { useState, useRef, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Trash2, 
  Download, 
  BarChart3,
  User
} from "lucide-react";
import { useEnhancedAIChat } from "@/features/ai/hooks/useEnhancedAIChat";
import AIChatMessage from "./AIChatMessage";
import ConversationStarters from "./ConversationStarters";
import ChatInput from "./ChatInput";
import { SmartReplySuggestions } from "./SmartReplySuggestions";
import ConversationAnalytics from "./ConversationAnalytics";
import ConnectionStatus from "./ConnectionStatus";
import { cn } from "@/lib/utils";

// Define proper message types for the chat interface
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  sender_type: "user" | "ai" | "coach" | "trainee";
}

const AIChatInterface = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    sendMessage,
    regenerateLastMessage,
    clearConversation,
    cancelRequest,
    userProfile,
    hasUserContext
  } = useEnhancedAIChat({
    systemPrompt: "You are FitGenius AI, a knowledgeable and supportive fitness assistant. Provide helpful, accurate advice about fitness, nutrition, and health. Keep responses well-structured with clear paragraphs, bullet points when appropriate, and easy-to-read formatting. Always encourage users and remind them to consult healthcare professionals for medical concerns.",
    maxMessages: 100,
    includeUserContext: true
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    console.log('Message feedback:', { messageId, feedback });
    // Here you could send feedback to your analytics service
  };

  const handleSendMessage = async (message: string) => {
    setInputMessage("");
    await sendMessage(message);
  };

  const handleSmartReplySelect = (reply: string) => {
    setInputMessage(reply);
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
  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop()?.content || "";

  // Convert messages for analytics and smart replies
  const convertedMessages: ChatMessage[] = messages.map(msg => ({
    id: msg.id || Date.now().toString(),
    role: msg.role as "user" | "assistant",
    content: msg.content,
    created_at: new Date().toISOString(),
    sender_type: msg.role === 'assistant' ? 'ai' : 'user' as "user" | "ai" | "coach" | "trainee"
  }));

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50/30 to-purple-50/30">
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 px-6 py-4" ref={scrollAreaRef}>
          {!hasMessages ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {userProfile?.first_name 
                    ? `Welcome back, ${userProfile.first_name}!` 
                    : 'Welcome to FitGenius AI'
                  }
                </h3>
                <p className="text-gray-600 text-base max-w-lg mx-auto mb-4 leading-relaxed">
                  {hasUserContext 
                    ? `I have access to your profile and can provide personalized fitness advice tailored to your ${userProfile?.fitness_goal || 'goals'}.` 
                    : 'I\'m here to help you with personalized fitness advice, nutrition guidance, and wellness tips.'
                  }
                </p>
                
                {/* User Context Display */}
                {hasUserContext && userProfile && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6 max-w-md mx-auto border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Your Profile Context</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      {userProfile.fitness_goal && (
                        <div>🎯 Goal: {userProfile.fitness_goal}</div>
                      )}
                      {userProfile.activity_level && (
                        <div>💪 Activity: {userProfile.activity_level}</div>
                      )}
                      {userProfile.age && userProfile.gender && (
                        <div>👤 {userProfile.age}y, {userProfile.gender}</div>
                      )}
                      {userProfile.dietary_restrictions?.length > 0 && (
                        <div>🥗 Dietary: {userProfile.dietary_restrictions.join(', ')}</div>
                      )}
                    </div>
                    <Badge className="mt-2 bg-green-100 text-green-700 border-green-200">
                      ✓ Personalized AI
                    </Badge>
                  </div>
                )}
              </div>
              
              <ConversationStarters 
                onStarterClick={sendMessage}
                className="w-full max-w-3xl"
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              {/* Enhanced Chat Controls */}
              <div className="flex items-center gap-2 justify-between mb-6 p-4 bg-white/80 rounded-xl border border-blue-100 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      {messages.length} messages
                    </Badge>
                    {hasUserContext && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Personalized for {userProfile?.first_name || 'You'}
                      </Badge>
                    )}
                    {isLoading && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs animate-pulse">
                        AI Responding...
                      </Badge>
                    )}
                    <ConnectionStatus isConnected={true} showText={false} />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className={cn(
                      "text-gray-600 hover:text-gray-800 hover:bg-gray-100 h-8 w-8 p-0",
                      showAnalytics && "bg-blue-100 text-blue-700"
                    )}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportConversation}
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearConversation}
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Conversation Analytics */}
              {showAnalytics && (
                <ConversationAnalytics 
                  messages={convertedMessages}
                  className="mb-6"
                />
              )}
              
              {/* Messages */}
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
            </div>
          )}
        </ScrollArea>

        {/* Enhanced Input Area */}
        <div className="border-t border-gray-200 bg-white">
          {/* Smart Reply Suggestions */}
          {hasMessages && lastAssistantMessage && (
            <SmartReplySuggestions
              conversationHistory={convertedMessages}
              onSelectReply={handleSmartReplySelect}
              className="mx-4 mt-4"
            />
          )}
          
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={false}
            isLoading={isLoading}
            onCancel={cancelRequest}
            placeholder={hasUserContext 
              ? `Ask me anything about fitness, nutrition, or health - I know your profile!` 
              : "Ask me anything about fitness, nutrition, or health..."
            }
            className="border-0"
            value={inputMessage}
            onChange={setInputMessage}
          />
        </div>
      </CardContent>
    </div>
  );
};

export default AIChatInterface;
