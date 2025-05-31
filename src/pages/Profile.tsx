
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";

const Profile = () => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const completionScore = profile?.profile_completion_score || 0;

  return (
    <ProtectedRoute>
      <Layout>
        <PageHeader
          title="Profile"
          description={`Complete your profile to get personalized recommendations (${completionScore}% complete)`}
          icon={<User className="h-6 w-6 text-blue-600" />}
        />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="basic" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Basic Info
            </TabsTrigger>
            <TabsTrigger 
              value="health" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Health
            </TabsTrigger>
            <TabsTrigger 
              value="goals" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Goals
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Overview</h3>
              <p className="text-gray-600">Your profile overview will be displayed here.</p>
            </div>
          </TabsContent>

          <TabsContent value="basic" className="mt-6">
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic Information</h3>
              <p className="text-gray-600">Edit your basic information here.</p>
            </div>
          </TabsContent>

          <TabsContent value="health" className="mt-6">
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Health Information</h3>
              <p className="text-gray-600">Manage your health data here.</p>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Goals & Preferences</h3>
              <p className="text-gray-600">Set your fitness goals and preferences.</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Settings</h3>
              <p className="text-gray-600">Manage your account settings here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </Layout>
    </ProtectedRoute>
  );
};

export default Profile;
