
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

const Admin = () => {
  return (
    <ProtectedRoute requireAuth requireAdmin>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <AdminHeader />
          <StatsCards />
          
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
              <UsersTable />
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
              <GenerationLogsTable />
            </TabsContent>
            
            <TabsContent value="sessions" className="space-y-4">
              <ActiveSessionsTable />
            </TabsContent>
            
            <TabsContent value="credits" className="space-y-4">
              <UserGenerationManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
