
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Target, Settings, Eye, Heart } from "lucide-react";

interface ProfileTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileTabNavigation = ({ activeTab, onTabChange }: ProfileTabNavigationProps) => {
  const tabs = [
    { value: "overview", icon: Eye, label: "Overview" },
    { value: "basic", icon: User, label: "Basic Info" },
    { value: "health", icon: Heart, label: "Health" },
    { value: "goals", icon: Target, label: "Goals" },
    { value: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-full mb-6">
      <TabsList className="grid w-full grid-cols-5 bg-white/90 backdrop-blur-sm border shadow-lg rounded-xl p-1.5 h-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className="flex flex-col items-center gap-1.5 p-3 text-xs data-[state=active]:text-white data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:shadow-md rounded-lg transition-all duration-200 hover:bg-gray-50"
            >
              <IconComponent className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
};

export default ProfileTabNavigation;
