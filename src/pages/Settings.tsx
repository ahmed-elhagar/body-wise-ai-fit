
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Settings as SettingsIcon } from "lucide-react";
import { EnhancedSettingsPage } from "@/components/settings/EnhancedSettingsPage";

const Settings = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <PageHeader
          title="Settings"
          description="Customize your app preferences and health profile"
          icon={<SettingsIcon className="h-6 w-6 text-gray-600" />}
        />
        
        <EnhancedSettingsPage />
      </Layout>
    </ProtectedRoute>
  );
};

export default Settings;
