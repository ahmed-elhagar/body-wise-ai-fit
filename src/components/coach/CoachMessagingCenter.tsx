
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Search, 
  Filter, 
  Send,
  Paperclip,
  MoreVertical,
  Star,
  Archive,
  CheckCheck,
  Clock,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  traineeId: string;
  traineeName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'general' | 'workout' | 'nutrition' | 'support';
}

interface Conversation {
  traineeId: string;
  traineeName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: 'active' | 'responded' | 'pending';
}

const CoachMessagingCenter = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newMessage, setNewMessage] = useState('');

  // Mock data - in real app this would come from your backend
  const conversations: Conversation[] = [
    {
      traineeId: '1',
      traineeName: 'John Smith',
      lastMessage: 'Thanks for the workout plan adjustment!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 0,
      status: 'responded'
    },
    {
      traineeId: '2',
      traineeName: 'Sarah Johnson',
      lastMessage: 'Having trouble with the nutrition plan',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 2,
      status: 'pending'
    },
    {
      traineeId: '3',
      traineeName: 'Mike Davis',
      lastMessage: 'Completed today\'s workout! 💪',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 6),
      unreadCount: 1,
      status: 'active'
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      traineeId: '2',
      traineeName: 'Sarah Johnson',
      content: 'Hi coach, I\'m having some trouble sticking to the nutrition plan. The portions seem too large for me.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: false,
      priority: 'medium',
      category: 'nutrition'
    },
    {
      id: '2',
      traineeId: '2',
      traineeName: 'Sarah Johnson',
      content: 'Also, I\'m not sure about the timing of my meals. Should I eat the pre-workout snack right before exercising?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      isRead: false,
      priority: 'medium',
      category: 'nutrition'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'responded': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-[calc(100vh-8rem)] gap-6">
          {/* Conversations Sidebar */}
          <Card className="w-80 flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages
              </CardTitle>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedFilter === 'unread' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter('unread')}
                  >
                    Unread
                  </Button>
                  <Button
                    variant={selectedFilter === 'urgent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter('urgent')}
                  >
                    Urgent
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="space-y-2 p-4">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.traineeId}
                      onClick={() => setSelectedConversation(conversation.traineeId)}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50",
                        selectedConversation === conversation.traineeId && "bg-blue-50 border-blue-200"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {conversation.traineeName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 text-sm">
                            {conversation.traineeName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          <Badge className={cn("text-xs", getStatusColor(conversation.status))}>
                            {conversation.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                        <Button variant="ghost" size="sm" className="p-1">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Main Chat Area */}
          <Card className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {conversations.find(c => c.traineeId === selectedConversation)?.traineeName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {conversations.find(c => c.traineeId === selectedConversation)?.traineeName}
                        </h3>
                        <p className="text-sm text-gray-600">Online now</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {messages
                        .filter(m => m.traineeId === selectedConversation)
                        .map((message) => (
                        <div key={message.id} className="flex gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-600 font-medium text-xs">
                              {message.traineeName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{message.traineeName}</span>
                              <Badge className={cn("text-xs", getPriorityColor(message.priority))}>
                                {message.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {message.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>

                <div className="border-t p-4">
                  <div className="flex gap-3">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a trainee from the list to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachMessagingCenter;
