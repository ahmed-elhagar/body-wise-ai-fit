
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import EnhancedSettingsForm from "../enhanced/EnhancedSettingsForm";

const ProfileSettingsTab = () => {
  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gradient-to-br from-white via-gray-50/30 to-slate-50/20 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedSettingsForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsTab;
