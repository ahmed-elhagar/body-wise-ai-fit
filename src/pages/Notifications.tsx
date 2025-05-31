
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Bell } from "lucide-react";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const Notifications = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Notifications
                </h1>
                <p className="text-gray-600 mt-1">
                  Stay updated with your fitness journey
                </p>
              </div>
            </div>

            {/* Notification Center */}
            <NotificationCenter />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Notifications;
