
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

const ProfileSettingsTab = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 text-fitness-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Account Settings</h3>
        </div>
        
        <div className="text-center py-8">
          <p className="text-gray-600">Account settings and preferences will be available soon.</p>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSettingsTab;
