
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const EnhancedSystemTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Enhanced system settings component</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSystemTab;
