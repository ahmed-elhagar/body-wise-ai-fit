
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Settings as SettingsIcon } from "lucide-react";
import { SettingsPage } from "@/features/settings";

const Settings = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          <PageHeader
            title="Settings"
            description="Customize your app preferences, notifications, and account settings"
            icon={<SettingsIcon className="h-6 w-6 text-gray-600" />}
          />
          
          <div className="px-6 pb-8">
            <div className="w-full max-w-7xl mx-auto">
              <SettingsPage />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Settings;
