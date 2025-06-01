
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, User } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/hooks/useI18n";

const AiChat = () => {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI fitness coach. How can I help you today?",
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: message,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "bot",
        content: "Thanks for your message! I'm here to help with your fitness journey. What specific area would you like to focus on?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">AI Chat</h1>
              <p className="text-gray-600 mt-2">Chat with your personal AI fitness coach</p>
            </div>

            <Card className="h-96 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`p-2 rounded-full ${msg.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        {msg.type === 'user' ? (
                          <User className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Bot className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className={`p-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <MessageSquare className="w-6 h-6 mb-2" />
                <span>Workout Tips</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <MessageSquare className="w-6 h-6 mb-2" />
                <span>Nutrition Advice</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <MessageSquare className="w-6 h-6 mb-2" />
                <span>Goal Setting</span>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AiChat;
