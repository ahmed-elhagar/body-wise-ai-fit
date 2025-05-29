
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User, Settings, Shield, LogOut, Eye, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ProfileAppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: any;
  user: any;
  isAdmin: boolean;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
}

export function ProfileAppSidebar({ 
  activeTab, 
  setActiveTab, 
  formData, 
  user, 
  isAdmin,
  isEditMode,
  setIsEditMode
}: ProfileAppSidebarProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleTabClick = (tab: string) => {
    if (tab === "overview") {
      setIsEditMode(false);
    }
    setActiveTab(tab);
  };

  const menuItems = [
    {
      title: "Overview",
      icon: Eye,
      key: "overview",
    },
    {
      title: "Basic Info",
      icon: User,
      key: "profile",
    },
    {
      title: "Health & Goals",
      icon: Edit,
      key: "goals",
    },
    {
      title: "Account Settings", 
      icon: Settings,
      key: "account",
    },
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-fitness-gradient rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : user?.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-800 truncate">
                {formData.first_name && formData.last_name 
                  ? `${formData.first_name} ${formData.last_name}` 
                  : "Your Profile"}
              </span>
              <span className="text-xs text-gray-600 truncate">{user?.email}</span>
            </div>
          </div>
          <SidebarTrigger className="lg:hidden" />
        </div>
        
        {/* Quick Stats - Desktop only */}
        <div className="hidden lg:block mt-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded text-center">
              <p className="text-gray-600">Height</p>
              <p className="font-semibold">{formData.height || "—"} cm</p>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <p className="text-gray-600">Weight</p>
              <p className="font-semibold">{formData.weight || "—"} kg</p>
            </div>
          </div>
          {formData.fitness_goal && (
            <div className="bg-gray-50 p-2 rounded text-center mt-2">
              <p className="text-gray-600 text-xs">Goal</p>
              <p className="font-semibold capitalize text-xs">{formData.fitness_goal?.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.key}>
              <SidebarMenuButton
                onClick={() => handleTabClick(item.key)}
                isActive={activeTab === item.key}
                className="w-full justify-start"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <SidebarMenu>
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate('/admin')}
                className="w-full justify-start text-yellow-700 hover:bg-yellow-50"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="w-full justify-start text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
