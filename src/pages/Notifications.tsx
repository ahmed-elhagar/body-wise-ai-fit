
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import ReminderSettings from "@/components/notifications/ReminderSettings";

const Notifications = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Notifications & Reminders
              </h1>
              <p className="text-gray-600">
                Stay on track with smart notifications and personalized reminders
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <NotificationCenter />
              <ReminderSettings />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Notifications;
