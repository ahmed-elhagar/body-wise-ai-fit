
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Mail, Lock, Shield, LogOut } from "lucide-react";
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
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg h-fit">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {formData.first_name && formData.last_name 
            ? `${formData.first_name} ${formData.last_name}` 
            : "Your Name"}
        </h3>
        <p className="text-sm text-gray-600 mb-1">{user?.email}</p>
        <p className="text-gray-600 mb-4">
          {formData.age ? `${formData.age} years old` : "Age not set"}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600">Height</p>
            <p className="font-semibold">{formData.height || "—"} cm</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600">Weight</p>
            <p className="font-semibold">{formData.weight || "—"} kg</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg col-span-2">
            <p className="text-gray-600">Goal</p>
            <p className="font-semibold capitalize">{formData.fitness_goal?.replace('_', ' ') || "Not set"}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="space-y-2 mb-6">
        <Button
          variant={activeTab === "profile" ? "default" : "ghost"}
          className={`w-full justify-start ${activeTab === "profile" ? "bg-fitness-gradient text-white" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <User className="w-4 h-4 mr-3" />
          Profile Info
        </Button>
        <Button
          variant={activeTab === "account" ? "default" : "ghost"}
          className={`w-full justify-start ${activeTab === "account" ? "bg-fitness-gradient text-white" : ""}`}
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
            className="w-full justify-start bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
          >
            <Shield className="w-4 h-4 mr-3" />
            Admin Panel
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="w-full justify-start text-red-600 hover:bg-red-50 border-red-200"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </Card>
  );
};

export default ProfileSidebar;
