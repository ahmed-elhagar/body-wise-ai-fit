
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

const NotificationCenter = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Notification center coming soon!</p>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
