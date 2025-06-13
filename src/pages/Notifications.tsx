
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Bell } from "lucide-react";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const Notifications = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <PageHeader
          title="Notifications"
          description="Stay updated with your fitness progress and reminders"
          icon={<Bell className="h-6 w-6 text-orange-600" />}
        />
        
        <NotificationCenter />
      </Layout>
    </ProtectedRoute>
  );
};

export default Notifications;
