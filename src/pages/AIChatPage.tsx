
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Loader2, Camera, Search } from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";
import Navigation from "@/components/Navigation";
import MealPhotoUpload from "@/components/MealPhotoUpload";
import FoodDatabaseSearch from "@/components/FoodDatabaseSearch";

const AIChatPage = () => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "photo" | "search">("chat");
  const { sendMessage, isSending, chatHistory, clearHistory } = useAIChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      sendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <Navigation />
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Fitness Assistant</h1>
            <p className="text-gray-600">Get personalized fitness advice, analyze meals, and search our food database</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-white rounded-lg p-1 shadow-lg">
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                onClick={() => setActiveTab("chat")}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </Button>
              <Button
                variant={activeTab === "photo" ? "default" : "ghost"}
                onClick={() => setActiveTab("photo")}
                className="flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Analyze Meal</span>
              </Button>
              <Button
                variant={activeTab === "search" ? "default" : "ghost"}
                onClick={() => setActiveTab("search")}
                className="flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Food Database</span>
              </Button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "chat" && (
            <div className="space-y-6">
              {/* Chat History */}
              <Card className="h-96 overflow-y-auto p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Start a conversation with your AI fitness assistant!</p>
                    <p className="text-sm mt-2">Ask about nutrition, workouts, or health tips.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-end">
                          <div className="bg-fitness-gradient text-white px-4 py-2 rounded-lg max-w-xs">
                            {chat.message}
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg max-w-md">
                            {chat.response}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Message Input */}
              <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask your fitness question here..."
                    disabled={isSending}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!message.trim() || isSending}
                    className="bg-fitness-gradient hover:opacity-90"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
                {chatHistory.length > 0 && (
                  <div className="mt-2 flex justify-end">
                    <Button variant="outline" size="sm" onClick={clearHistory}>
                      Clear History
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === "photo" && <MealPhotoUpload />}
          
          {activeTab === "search" && <FoodDatabaseSearch />}
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
