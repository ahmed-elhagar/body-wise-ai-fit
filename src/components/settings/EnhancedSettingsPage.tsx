
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const EnhancedSettingsPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Enhanced settings page coming soon!</p>
      </CardContent>
    </Card>
  );
};

export default EnhancedSettingsPage;
