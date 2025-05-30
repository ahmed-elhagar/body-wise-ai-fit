
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Users, TrendingUp, Star, Calendar, Target } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { useRole } from "@/hooks/useRole";
import { useCoach } from "@/hooks/useCoach";
import { Navigate } from "react-router-dom";

const Coach = () => {
  const { isCoach, isLoading } = useRole();
  const { clients, chats, coachStats } = useCoach();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!isCoach) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-3 md:p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            {/* Enhanced Header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10 rounded-2xl" />
              
              <Card className="relative p-4 md:p-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
                <div className="absolute top-2 right-2 md:top-4 md:right-4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Coach Dashboard
                      </h1>
                      <p className="text-sm md:text-base text-gray-600 font-medium">
                        Manage your clients and coaching sessions
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 px-3 py-1 text-xs md:text-sm font-semibold shadow-md">
                      <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      {coachStats?.totalClients || 0} Active Clients
                    </Badge>
                    <Badge variant="outline" className="bg-white/80 border-gray-200 text-gray-700 px-3 py-1 text-xs md:text-sm font-medium">
                      <Star className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      Professional Coach
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{coachStats?.totalClients || 0}</div>
                  <p className="text-xs text-muted-foreground">Active coaching relationships</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">Messages Today</CardTitle>
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{coachStats?.messagesToday || 0}</div>
                  <p className="text-xs text-muted-foreground">Client interactions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{coachStats?.successRate || 0}%</div>
                  <p className="text-xs text-muted-foreground">Client goal achievement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">This Month</CardTitle>
                  <Calendar className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{coachStats?.monthlyGoals || 0}</div>
                  <p className="text-xs text-muted-foreground">Goals completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="clients" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 shadow-sm">
                <TabsTrigger 
                  value="clients" 
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  My Clients
                </TabsTrigger>
                <TabsTrigger 
                  value="chats" 
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  Active Chats
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="clients" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Client Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clients && clients.length > 0 ? (
                      <div className="space-y-4">
                        {clients.map((client: any) => (
                          <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-semibold">{client.name}</h3>
                              <p className="text-sm text-gray-600">{client.email}</p>
                              <Badge variant="outline" className="mt-1">
                                {client.fitnessGoal || 'General Fitness'}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedClient(client.id)}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Chat
                              </Button>
                              <Button variant="outline" size="sm">
                                <Target className="h-4 w-4 mr-1" />
                                Progress
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients yet</h3>
                        <p className="text-gray-600">Clients will appear here when they're assigned to you.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chats" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Active Conversations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No active chats</h3>
                      <p className="text-gray-600">Recent conversations with your clients will appear here.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Coaching Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                      <p className="text-gray-600">Detailed coaching analytics and client progress reports will be available here.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Coach;
