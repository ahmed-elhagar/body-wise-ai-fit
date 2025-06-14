
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const EnhancedSystemTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          System Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">System configuration coming soon!</p>
      </CardContent>
    </Card>
  );
};

export default EnhancedSystemTab;
