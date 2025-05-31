
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Calendar,
  Award,
  Target,
  Activity,
  Bell,
  Filter,
  Search,
  MoreVertical,
  Plus,
  Clock
} from "lucide-react";
import { useState } from "react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { cn } from "@/lib/utils";

interface TraineeMetrics {
  id: string;
  name: string;
  progress: number;
  lastActivity: string;
  workoutCompliance: number;
  nutritionCompliance: number;
  unreadMessages: number;
  status: 'active' | 'inactive' | 'at-risk';
}

const EnhancedCoachDashboard = () => {
  const { trainees, isLoadingTrainees } = useCoachSystem();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock metrics data - in real app this would come from your backend
  const mockMetrics: TraineeMetrics[] = trainees.map(trainee => ({
    id: trainee.id,
    name: `${trainee.trainee_profile?.first_name || ''} ${trainee.trainee_profile?.last_name || ''}`.trim() || 'Unknown',
    progress: Math.floor(Math.random() * 100),
    lastActivity: `${Math.floor(Math.random() * 7) + 1} days ago`,
    workoutCompliance: Math.floor(Math.random() * 100),
    nutritionCompliance: Math.floor(Math.random() * 100),
    unreadMessages: Math.floor(Math.random() * 5),
    status: ['active', 'inactive', 'at-risk'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'at-risk'
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coach Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your trainees and track their progress</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Trainee
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Trainees</p>
                  <p className="text-2xl font-bold text-blue-900">{trainees.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Active This Week</p>
                  <p className="text-2xl font-bold text-green-900">
                    {mockMetrics.filter(m => m.status === 'active').length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Avg Progress</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {Math.round(mockMetrics.reduce((acc, m) => acc + m.progress, 0) / mockMetrics.length)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Unread Messages</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {mockMetrics.reduce((acc, m) => acc + m.unreadMessages, 0)}
                  </p>
                </div>
                <MessageCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="trainees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trainees">Trainees</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="trainees" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-2">
                    <Button 
                      variant={selectedFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedFilter('all')}
                    >
                      All
                    </Button>
                    <Button 
                      variant={selectedFilter === 'active' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedFilter('active')}
                    >
                      Active
                    </Button>
                    <Button 
                      variant={selectedFilter === 'at-risk' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedFilter('at-risk')}
                    >
                      At Risk
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search trainees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trainees Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockMetrics.map((trainee) => (
                <Card key={trainee.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {trainee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{trainee.name}</h3>
                          <p className="text-sm text-gray-600">Last active: {trainee.lastActivity}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-gray-600">{trainee.progress}%</span>
                    </div>
                    <Progress value={trainee.progress} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Workouts</p>
                        <p className="font-semibold text-blue-600">{trainee.workoutCompliance}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Nutrition</p>
                        <p className="font-semibold text-green-600">{trainee.nutritionCompliance}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <Badge className={cn("text-xs", getStatusColor(trainee.status))}>
                        {trainee.status}
                      </Badge>
                      <div className="flex gap-2">
                        {trainee.unreadMessages > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {trainee.unreadMessages} new
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Progress tracking features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Message Center</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Message management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedCoachDashboard;
