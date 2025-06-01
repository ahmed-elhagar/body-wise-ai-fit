
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Trash2, Settings } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Notifications = () => {
  const { t } = useI18n();

  const notifications = [
    {
      id: 1,
      title: "Meal Plan Ready",
      message: "Your weekly meal plan has been generated and is ready for review.",
      time: "2 hours ago",
      read: false,
      type: "success"
    },
    {
      id: 2,
      title: "Workout Reminder",
      message: "Time for your evening workout! Don't forget to warm up.",
      time: "4 hours ago",
      read: false,
      type: "info"
    },
    {
      id: 3,
      title: "Goal Achievement",
      message: "Congratulations! You've reached your weekly exercise goal.",
      time: "1 day ago",
      read: true,
      type: "success"
    },
    {
      id: 4,
      title: "Progress Update",
      message: "Your weight tracking shows positive progress this week.",
      time: "2 days ago",
      read: true,
      type: "info"
    }
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-2">Stay updated with your fitness journey</p>
              </div>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button size="sm">
                  <Check className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
              <Badge variant="secondary">
                {notifications.filter(n => !n.read).length} unread
              </Badge>
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className={`p-4 ${!notification.read ? 'border-blue-200 bg-blue-50/50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <Bell className={`w-4 h-4 ${
                          notification.type === 'success' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{notification.title}</h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-2">{notification.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button size="sm" variant="ghost">
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Notifications;
