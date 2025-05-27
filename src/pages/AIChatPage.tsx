
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Bot, User, Loader2 } from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";
import { useProfile } from "@/hooks/useProfile";

const AIChatPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { chatHistory, sendMessage, isSending } = useAIChat();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!message.trim() || isSending) return;
    
    sendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">FitGenie AI Coach</h1>
              <p className="text-gray-600">Your personal AI fitness and nutrition assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Online</span>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="h-[70vh] flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Welcome Message */}
            {(!chatHistory || chatHistory.length === 0) && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-fitness-gradient rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-4 max-w-md">
                  <p className="text-gray-800">
                    Hi {profile?.first_name}! 👋 I'm FitGenie, your AI fitness coach. 
                    I'm here to help you with personalized workout plans, nutrition advice, 
                    and answer any fitness-related questions you have. How can I assist you today?
                  </p>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {chatHistory?.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  msg.message_type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.message_type === 'user' 
                    ? 'bg-fitness-primary' 
                    : 'bg-fitness-gradient'
                }`}>
                  {msg.message_type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className={`rounded-lg p-4 max-w-md ${
                  msg.message_type === 'user'
                    ? 'bg-fitness-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="whitespace-pre-wrap">
                    {msg.message_type === 'user' ? msg.message : msg.response}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isSending && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-fitness-gradient rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-gray-600">FitGenie is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about fitness, nutrition, or workouts..."
                className="flex-1"
                disabled={isSending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isSending}
                className="bg-fitness-gradient hover:opacity-90 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Create a workout plan for me",
            "What should I eat for breakfast?",
            "How can I lose weight safely?",
            "Best exercises for building muscle",
            "Help me with my nutrition goals"
          ].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setMessage(suggestion)}
              className="bg-white/80 hover:bg-gray-50"
              disabled={isSending}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
