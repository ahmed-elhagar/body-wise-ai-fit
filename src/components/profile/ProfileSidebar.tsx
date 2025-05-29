
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: any;
  user: any;
  isAdmin: boolean;
}

const ProfileSidebar = ({ activeTab, setActiveTab, formData, user, isAdmin }: ProfileSidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg w-full">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">
            {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : user?.email?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1 break-words">
          {formData.first_name && formData.last_name 
            ? `${formData.first_name} ${formData.last_name}` 
            : "Your Name"}
        </h3>
        <p className="text-sm text-gray-600 mb-1 break-all">{user?.email}</p>
        {formData.age && (
          <p className="text-sm text-gray-600 mb-4">{formData.age} years old</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-3 text-sm mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-gray-600 text-xs">Height</p>
            <p className="font-semibold">{formData.height || "—"} cm</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-gray-600 text-xs">Weight</p>
            <p className="font-semibold">{formData.weight || "—"} kg</p>
          </div>
        </div>
        {formData.fitness_goal && (
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-gray-600 text-xs">Goal</p>
            <p className="font-semibold capitalize text-sm">{formData.fitness_goal?.replace('_', ' ')}</p>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="space-y-2 mb-6">
        <Button
          variant={activeTab === "profile" ? "default" : "ghost"}
          className={`w-full justify-start text-sm ${activeTab === "profile" ? "bg-fitness-gradient text-white" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <User className="w-4 h-4 mr-3" />
          Profile Info
        </Button>
        <Button
          variant={activeTab === "account" ? "default" : "ghost"}
          className={`w-full justify-start text-sm ${activeTab === "account" ? "bg-fitness-gradient text-white" : ""}`}
          onClick={() => setActiveTab("account")}
        >
          <Settings className="w-4 h-4 mr-3" />
          Account Settings
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        {isAdmin && (
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="w-full justify-start text-sm bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
          >
            <Shield className="w-4 h-4 mr-3" />
            Admin Panel
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="w-full justify-start text-sm text-red-600 hover:bg-red-50 border-red-200"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </Card>
  );
};

export default ProfileSidebar;
