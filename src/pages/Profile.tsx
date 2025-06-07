
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Heart, Target, Bell } from "lucide-react";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";
import { ProfileTabContent } from "@/components/profile/ProfileTabContent";
import EnhancedPageLoading from "@/components/ui/enhanced-page-loading";

const Profile = () => {
  const { profile, isLoading } = useEnhancedProfile();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedPageLoading
          isLoading={true}
          type="general"
          title="Loading Profile"
          description="Getting your information..."
          timeout={5000}
        />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "basic", label: "Basic Info", icon: User },
    { id: "goals", label: "Goals", icon: Target },
    { id: "health", label: "Health", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      <Card className="bg-white shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-50 p-1 rounded-lg">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center space-x-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <ProfileTabContent tabId={tab.id} />
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile;
