
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Plus, MessageCircle, TrendingUp } from "lucide-react";
import { useCoach } from "@/hooks/useCoach";
import CompactTasksPanel from "./overview/CompactTasksPanel";

const EnhancedTraineesTab = () => {
  const { trainees, isLoading } = useCoach();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTrainees = trainees?.filter(trainee =>
    trainee.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainee.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const mockTasks = [
    {
      id: '1',
      title: 'Complete weekly weigh-in',
      status: 'pending' as const,
      dueDate: '2024-01-15',
      priority: 'high' as const
    },
    {
      id: '2',
      title: 'Log daily meals',
      status: 'completed' as const,
      dueDate: '2024-01-14',
      priority: 'medium' as const
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i =>
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">My Trainees</h2>
          <Badge variant="secondary">{filteredTrainees.length}</Badge>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trainees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Trainee
          </Button>
        </div>
      </div>

      {/* Tasks Overview */}
      <CompactTasksPanel tasks={mockTasks} className="bg-blue-50 border-blue-200" />

      {/* Trainees Grid */}
      {filteredTrainees.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No trainees found' : 'No trainees yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start building your coaching practice by adding your first trainee'
              }
            </p>
            {!searchTerm && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Trainee
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainees.map((trainee) => (
            <Card key={trainee.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {trainee.profiles?.first_name} {trainee.profiles?.last_name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Member since {new Date(trainee.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Progress</p>
                      <p className="font-medium">85% to goal</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Check-in</p>
                      <p className="font-medium">2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Progress
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedTraineesTab;
