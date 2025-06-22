
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MessageSquare, 
  Calendar,
  Trash2,
  Download,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSession {
  id: string;
  title: string;
  messageCount: number;
  lastMessage: string;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
}

interface ChatHistoryProps {
  onSelectSession?: (sessionId: string) => void;
  className?: string;
}

const ChatHistory = ({ onSelectSession, className }: ChatHistoryProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data - in a real app, this would come from your backend
  useEffect(() => {
    const mockSessions: ChatSession[] = [
      {
        id: '1',
        title: 'Weight Loss Journey',
        messageCount: 15,
        lastMessage: 'Thank you for the workout plan!',
        createdAt: new Date(2024, 0, 15),
        updatedAt: new Date(2024, 0, 15),
        category: 'Weight Loss'
      },
      {
        id: '2',
        title: 'Nutrition Questions',
        messageCount: 8,
        lastMessage: 'What about protein intake?',
        createdAt: new Date(2024, 0, 10),
        updatedAt: new Date(2024, 0, 12),
        category: 'Nutrition'
      },
      {
        id: '3',
        title: 'Home Workout Plan',
        messageCount: 22,
        lastMessage: 'These exercises are perfect!',
        createdAt: new Date(2024, 0, 5),
        updatedAt: new Date(2024, 0, 8),
        category: 'Exercise'
      }
    ];
    setSessions(mockSessions);
  }, []);

  const categories = ['all', 'Exercise', 'Nutrition', 'Weight Loss', 'Health'];

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat History
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {sessions.length} conversations
          </Badge>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap text-xs"
            >
              {category === 'all' ? 'All' : category}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'No conversations match your search'
                  : 'No conversations yet'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {filteredSessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => onSelectSession?.(session.id)}
                  className="group p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm group-hover:text-blue-700 truncate flex-1">
                      {session.title}
                    </h4>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {session.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {session.messageCount} messages
                      </Badge>
                      {session.category && (
                        <Badge variant="secondary" className="text-xs">
                          {session.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(session.updatedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChatHistory;
