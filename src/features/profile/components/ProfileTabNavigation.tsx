
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Target, Heart, Settings } from "lucide-react";

interface ProfileTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileTabNavigation = React.memo(({ activeTab, onTabChange }: ProfileTabNavigationProps) => {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <User className="w-4 h-4" />
        Overview
      </TabsTrigger>
      <TabsTrigger value="health" className="flex items-center gap-2">
        <Heart className="w-4 h-4" />
        Health
      </TabsTrigger>
      <TabsTrigger value="goals" className="flex items-center gap-2">
        <Target className="w-4 h-4" />
        Goals
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex items-center gap-2">
        <Settings className="w-4 h-4" />
        Settings
      </TabsTrigger>
    </TabsList>
  );
});

ProfileTabNavigation.displayName = 'ProfileTabNavigation';

export default ProfileTabNavigation;
