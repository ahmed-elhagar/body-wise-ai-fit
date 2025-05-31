
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Trash2, 
  Copy,
  CheckCircle,
  ArrowLeft,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAIChat, ChatMessage } from "@/hooks/useAIChat";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

const AIChatPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isSending, chatHistory, clearHistory } = useAIChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    sendMessage(message, {
      onSuccess: () => {
        setMessage("");
      },
      onError: (error: any) => {
        console.error('Error sending message:', error);
        toast.error('Failed to send message. Please try again.');
      }
    });
  };

  const handleCopyMessage = async (messageText: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopiedMessageId(messageId);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    toast.success('Chat history cleared');
  };

  const formatMessageText = (text: string) => {
    // Convert basic markdown to HTML-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.message_type === 'user';
    const messageText = isUser ? msg.message : msg.response;
    
    return (
      <div
        key={msg.id}
        className={cn(
          "flex gap-3 max-w-4xl mx-auto",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}
        
        <div className={cn(
          "group relative max-w-[85%] rounded-2xl px-4 py-3 shadow-lg",
          isUser 
            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white ml-auto" 
            : "bg-white border border-gray-200"
        )}>
          <div className={cn(
            "text-sm leading-relaxed",
            isUser ? "text-white" : "text-gray-800"
          )}>
            {messageText && (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: formatMessageText(messageText) 
                }} 
              />
            )}
          </div>
          
          <div className={cn(
            "flex items-center justify-between mt-2 pt-2 border-t",
            isUser ? "border-blue-500/30" : "border-gray-100"
          )}>
            <span className={cn(
              "text-xs",
              isUser ? "text-blue-100" : "text-gray-500"
            )}>
              {new Date(msg.created_at).toLocaleTimeString()}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyMessage(messageText || '', msg.id)}
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0",
                isUser 
                  ? "hover:bg-blue-500/20 text-blue-100 hover:text-white" 
                  : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              )}
            >
              {copiedMessageId === msg.id ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
        
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Enhanced Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="p-2 hover:bg-white/80 shadow-md"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        AI Fitness Coach
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                      </h1>
                      <p className="text-gray-600">Your personal AI-powered fitness assistant</p>
                    </div>
                  </div>
                </div>

                {chatHistory.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleClearHistory}
                    className="bg-white/80 hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                )}
              </div>

              {/* AI Capabilities Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-800">Nutrition Advice</h3>
                    </div>
                    <p className="text-sm text-gray-600">Get personalized meal suggestions and nutrition guidance</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Bot className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-800">Workout Plans</h3>
                    </div>
                    <p className="text-sm text-gray-600">Custom exercise routines based on your goals</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-800">Health Tips</h3>
                    </div>
                    <p className="text-sm text-gray-600">Expert wellness advice and lifestyle recommendations</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Chat Container */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    Chat with AI Coach
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                    {chatHistory.length} messages
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages Area */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-gray-50/50 to-blue-50/30">
                  {chatHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                        <Bot className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Welcome to AI Fitness Coach!
                      </h3>
                      <p className="text-gray-600 max-w-md mb-6">
                        I'm here to help you with nutrition advice, workout plans, and wellness tips. 
                        What would you like to know about your fitness journey?
                      </p>
                      
                      {/* Quick Start Suggestions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                        {[
                          "Create a beginner workout plan",
                          "Suggest healthy meal ideas",
                          "Help me lose weight safely",
                          "Improve my diet habits"
                        ].map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setMessage(suggestion)}
                            className="p-3 text-sm bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {chatHistory.map(renderMessage)}
                      {isSending && (
                        <div className="flex gap-3 max-w-4xl mx-auto">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-lg">
                            <div className="flex items-center gap-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-sm text-gray-500">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t bg-white p-6">
                  <form onSubmit={handleSubmit} className="flex gap-3">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask me anything about fitness, nutrition, or wellness..."
                      className="flex-1 min-h-[60px] max-h-[120px] resize-none border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      disabled={isSending}
                    />
                    <Button
                      type="submit"
                      disabled={!message.trim() || isSending}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </form>
                  
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Press Enter to send, Shift + Enter for new line
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AIChatPage;
