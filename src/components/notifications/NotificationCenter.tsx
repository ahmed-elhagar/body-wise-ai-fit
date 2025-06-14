
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationCenter = () => {
  const notifications = [
    {
      id: 1,
      title: "Meal Plan Ready",
      message: "Your weekly meal plan has been generated successfully!",
      type: "success",
      time: "2 minutes ago",
      read: false
    },
    {
      id: 2,
      title: "Exercise Reminder",
      message: "Time for your afternoon workout session.",
      type: "info",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      title: "Goal Achievement",
      message: "Congratulations! You've reached your weekly protein goal.",
      type: "success",
      time: "2 hours ago",
      read: true
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      {notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notifications</h3>
          <p className="text-gray-500">You're all caught up!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`transition-all ${notification.read ? 'opacity-75' : 'shadow-md'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {notification.title}
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      )}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-sm text-gray-400 mt-2">{notification.time}</p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button size="sm" variant="outline">
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
