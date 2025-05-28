
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAIChat } from "@/hooks/useAIChat";
import Navigation from "@/components/Navigation";
import { Send, Bot, User, Trash2, Copy, Check } from "lucide-react";

const AIChatPage = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, isSending, chatHistory, clearHistory } = useAIChat();
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;
    
    sendMessage(message);
    setMessage("");
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatMessage = (text: string) => {
    // Split by common markdown patterns and format them
    return text.split('\n').map((line, index) => {
      // Handle headers
      if (line.startsWith('###')) {
        return <h3 key={index} className="font-bold text-lg mt-4 mb-2">{line.replace('###', '').trim()}</h3>;
      }
      if (line.startsWith('##')) {
        return <h2 key={index} className="font-bold text-xl mt-4 mb-2">{line.replace('##', '').trim()}</h2>;
      }
      
      // Handle bold text
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\./.test(line.trim())) {
        return <li key={index} className="ml-4 mb-1">{line.trim()}</li>;
      }
      
      // Handle bullet points
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return <li key={index} className="ml-4 mb-1 list-disc">{line.replace(/^[-•]\s*/, '').trim()}</li>;
      }
      
      // Regular paragraphs
      if (line.trim()) {
        return <p key={index} className="mb-2">{line}</p>;
      }
      
      // Empty lines
      return <br key={index} />;
    });
  };

  const getContextualQuestions = () => {
    if (chatHistory.length === 0) {
      return [
        "What's a good beginner workout routine?",
        "How many calories should I eat to lose weight?",
        "What are the best protein sources?",
        "How often should I exercise per week?"
      ];
    }

    // Get the last user message to determine context
    const lastUserMessage = chatHistory.filter(msg => msg.message_type === 'user').pop();
    const lastMessage = lastUserMessage?.message?.toLowerCase() || '';

    if (lastMessage.includes('workout') || lastMessage.includes('exercise')) {
      return [
        "How do I track my workout progress?",
        "What exercises are best for building muscle?",
        "How long should I rest between sets?",
        "Can you suggest a home workout routine?"
      ];
    }

    if (lastMessage.includes('calorie') || lastMessage.includes('weight') || lastMessage.includes('diet')) {
      return [
        "What foods should I avoid for weight loss?",
        "How do I calculate my daily calorie needs?",
        "What's the best meal timing for my goals?",
        "Can you help me plan healthy snacks?"
      ];
    }

    if (lastMessage.includes('protein') || lastMessage.includes('nutrition')) {
      return [
        "How much protein do I need daily?",
        "What are good carb sources for athletes?",
        "Should I take supplements?",
        "How do I meal prep for the week?"
      ];
    }

    if (lastMessage.includes('beginner') || lastMessage.includes('start')) {
      return [
        "What equipment do I need to start?",
        "How do I stay motivated?",
        "What are common beginner mistakes?",
        "How quickly will I see results?"
      ];
    }

    // Default follow-up questions
    return [
      "Can you be more specific about my situation?",
      "What would you recommend for my fitness level?",
      "How can I stay consistent with this?",
      "Are there any alternatives you'd suggest?"
    ];
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
                AI Fitness Coach 🤖
              </h1>
              <p className="text-gray-600">
                Your personal fitness companion for workouts, nutrition, and wellness advice
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
            <div className="h-96 overflow-y-auto mb-4 space-y-6">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Welcome to your AI Fitness Coach!</p>
                  <p className="text-sm mt-2 max-w-md mx-auto">
                    I'm here to help you with personalized fitness advice, workout routines, nutrition tips, and answer any health-related questions you have.
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
                      <div className="w-8 h-8 bg-fitness-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-xs md:max-w-2xl p-4 rounded-lg relative group ${
                        chat.message_type === 'user'
                          ? 'bg-fitness-gradient text-white'
                          : 'bg-gray-50 text-gray-800 border'
                      }`}
                    >
                      <div className="text-sm leading-relaxed">
                        {chat.message_type === 'user' ? (
                          <p>{chat.message}</p>
                        ) : (
                          <div className="space-y-2">
                            {formatMessage(chat.response || '')}
                          </div>
                        )}
                      </div>
                      
                      {/* Copy button for AI responses */}
                      {chat.message_type === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(chat.response || '', chat.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                          title="Copy message"
                        >
                          {copiedMessageId === chat.id ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-500" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    {chat.message_type === 'user' && (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything about fitness, nutrition, or wellness..."
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

          {/* Dynamic Quick Questions */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {chatHistory.length === 0 ? 'Quick Questions to Get Started' : 'Follow-up Questions'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getContextualQuestions().map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => setMessage(question)}
                  className="text-left justify-start h-auto p-3 text-sm hover:bg-gray-50"
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
