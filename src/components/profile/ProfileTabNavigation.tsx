
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Target, Settings, Eye, Heart } from "lucide-react";

interface ProfileTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileTabNavigation = ({ activeTab, onTabChange }: ProfileTabNavigationProps) => {
  return (
    <TabsList className="grid w-full grid-cols-5 mb-4 h-auto p-1 bg-white/80 backdrop-blur-sm">
      <TabsTrigger value="overview" className="flex flex-col items-center gap-1 p-3 text-xs">
        <Eye className="w-4 h-4" />
        <span>Overview</span>
      </TabsTrigger>
      <TabsTrigger value="basic" className="flex flex-col items-center gap-1 p-3 text-xs">
        <User className="w-4 h-4" />
        <span>Basic Info</span>
      </TabsTrigger>
      <TabsTrigger value="health" className="flex flex-col items-center gap-1 p-3 text-xs">
        <Heart className="w-4 h-4" />
        <span>Health</span>
      </TabsTrigger>
      <TabsTrigger value="goals" className="flex flex-col items-center gap-1 p-3 text-xs">
        <Target className="w-4 h-4" />
        <span>Goals</span>
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex flex-col items-center gap-1 p-3 text-xs">
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default ProfileTabNavigation;
