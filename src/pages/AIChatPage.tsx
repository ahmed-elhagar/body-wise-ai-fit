
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAIChat } from "@/hooks/useAIChat";
import Navigation from "@/components/Navigation";
import { Send, Bot, User, Trash2 } from "lucide-react";

const AIChatPage = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, isSending, chatHistory, clearHistory } = useAIChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;
    
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="md:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                AI Fitness Chat 🤖
              </h1>
              <p className="text-gray-600">
                Ask questions about fitness, nutrition, or get personalized advice
              </p>
            </div>
            
            {chatHistory.length > 0 && (
              <Button
                variant="outline"
                onClick={clearHistory}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Chat</span>
              </Button>
            )}
          </div>

          {/* Chat Area */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
            <div className="h-96 overflow-y-auto mb-4 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Start a conversation with your AI fitness coach!</p>
                  <p className="text-sm mt-2">
                    Try asking: "What's a good workout for beginners?" or "How many calories should I eat?"
                  </p>
                </div>
              ) : (
                chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-start space-x-3 ${
                      chat.message_type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {chat.message_type === 'assistant' && (
                      <div className="w-8 h-8 bg-fitness-gradient rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                        chat.message_type === 'user'
                          ? 'bg-fitness-gradient text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {chat.message_type === 'user' ? chat.message : chat.response}
                      </p>
                    </div>
                    
                    {chat.message_type === 'user' && (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {isSending && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-fitness-gradient rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything about fitness..."
                className="flex-1"
                disabled={isSending}
              />
              <Button
                type="submit"
                disabled={isSending || !message.trim()}
                className="bg-fitness-gradient hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>

          {/* Quick Questions */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "What's a good beginner workout routine?",
                "How many calories should I eat to lose weight?",
                "What are the best protein sources?",
                "How often should I exercise per week?"
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => setMessage(question)}
                  className="text-left justify-start h-auto p-3 text-sm"
                  disabled={isSending}
                >
                  {question}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
