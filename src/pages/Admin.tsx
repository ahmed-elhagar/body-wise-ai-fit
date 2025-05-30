
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import UsersTable from "@/components/admin/UsersTable";
import SubscriptionsTab from "@/components/admin/SubscriptionsTab";
import CoachesTab from "@/components/admin/CoachesTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import GenerationLogsTable from "@/components/admin/GenerationLogsTable";
import ActiveSessionsTable from "@/components/admin/ActiveSessionsTable";
import UserGenerationManager from "@/components/admin/UserGenerationManager";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const Admin = () => {
  const { forceLogoutAllUsers } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleForceLogout = async () => {
    setIsLoggingOut(true);
    try {
      await forceLogoutAllUsers();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleUpdateGenerations = (userId: string, newLimit: string) => {
    console.log('Update generations for user:', userId, 'to:', newLimit);
    // TODO: Implement generation limit update
  };

  // Mock data - in a real app, these would come from API calls
  const mockUsers = [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com'
    }
  ];

  const mockLogs = [
    {
      id: '1',
      generation_type: 'meal_plan',
      status: 'completed',
      user_id: '1',
      created_at: new Date().toISOString()
    }
  ];

  const mockSessions = [
    {
      id: '1',
      user_id: '1',
      session_id: 'session_123',
      last_activity: new Date().toISOString(),
      user_agent: 'Mozilla/5.0'
    }
  ];

  return (
    <ProtectedRoute requireRole="admin">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <AdminHeader onForceLogout={handleForceLogout} isLoggingOut={isLoggingOut} />
          <StatsCards 
            totalUsers={150}
            activeUsers={45}
            totalActiveSessions={12}
            totalGenerations={1250}
          />
          
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="users" data-testid="users-tab">Users</TabsTrigger>
              <TabsTrigger value="subscriptions" data-testid="subscriptions-tab">Subscriptions</TabsTrigger>
              <TabsTrigger value="coaches" data-testid="coaches-tab">Coaches</TabsTrigger>
              <TabsTrigger value="analytics" data-testid="analytics-tab">Analytics</TabsTrigger>
              <TabsTrigger value="generations" data-testid="generations-tab">AI Logs</TabsTrigger>
              <TabsTrigger value="sessions" data-testid="sessions-tab">Sessions</TabsTrigger>
              <TabsTrigger value="credits" data-testid="credits-tab">Credits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              <UsersTable users={mockUsers} />
            </TabsContent>
            
            <TabsContent value="subscriptions" className="space-y-4">
              <SubscriptionsTab />
            </TabsContent>
            
            <TabsContent value="coaches" className="space-y-4">
              <CoachesTab />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <AnalyticsTab />
            </TabsContent>
            
            <TabsContent value="generations" className="space-y-4">
              <GenerationLogsTable logs={mockLogs} />
            </TabsContent>
            
            <TabsContent value="sessions" className="space-y-4">
              <ActiveSessionsTable activeSessions={mockSessions} />
            </TabsContent>
            
            <TabsContent value="credits" className="space-y-4">
              <UserGenerationManager 
                users={mockUsers}
                onUpdateGenerations={handleUpdateGenerations}
                isUpdating={false}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
