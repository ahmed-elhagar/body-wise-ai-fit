
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, User, Send, Loader2, Camera, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAIChat } from "@/hooks/useAIChat";
import MealPhotoUpload from "@/components/MealPhotoUpload";
import FoodDatabaseSearch from "@/components/FoodDatabaseSearch";

const AIChatPage = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, isLoading, messages } = useAIChat();

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <Navigation />
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                AI Fitness Assistant
              </h1>
              <p className="text-gray-600">
                Get personalized fitness advice, meal analysis, and nutrition guidance
              </p>
            </div>

            <Tabs defaultValue="chat" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat" className="flex items-center">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger value="analyze" className="flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  Analyze Meal
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Food Database
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <div className="h-96 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-16">
                        <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Ask me anything about fitness, nutrition, or health!</p>
                        <div className="mt-4 space-y-2 text-sm">
                          <p>Try asking:</p>
                          <div className="space-y-1 text-gray-400">
                            <p>"What should I eat before a workout?"</p>
                            <p>"How many calories should I eat daily?"</p>
                            <p>"Best exercises for weight loss?"</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex items-start space-x-2 max-w-[80%]`}>
                            {msg.role === "assistant" && (
                              <div className="bg-fitness-primary text-white p-2 rounded-full">
                                <Bot className="w-4 h-4" />
                              </div>
                            )}
                            <div
                              className={`p-3 rounded-lg ${
                                msg.role === "user"
                                  ? "bg-fitness-gradient text-white"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            {msg.role === "user" && (
                              <div className="bg-gray-300 text-gray-600 p-2 rounded-full">
                                <User className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-2">
                          <div className="bg-fitness-primary text-white p-2 rounded-full">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about fitness, nutrition, or health..."
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isLoading || !message.trim()}
                        className="bg-fitness-gradient hover:opacity-90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="analyze">
                <MealPhotoUpload />
              </TabsContent>

              <TabsContent value="search">
                <FoodDatabaseSearch />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
