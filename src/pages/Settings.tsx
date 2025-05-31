
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Settings = () => {
  const { t } = useI18n();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <SettingsIcon className="h-8 w-8 text-gray-600" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {t('Settings')}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t('Manage your account preferences and settings')}
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t('Settings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <SettingsIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('Settings Coming Soon')}
                  </h3>
                  <p className="text-gray-600">
                    {t('Advanced settings and preferences will be available here.')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Settings;
