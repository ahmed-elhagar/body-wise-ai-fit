
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Database, 
  Activity, 
  Settings,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users
} from 'lucide-react';
import FeatureFlagToggle from './FeatureFlagToggle';
import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags';
import { useLanguage } from '@/contexts/LanguageContext';

const EnhancedSystemTab: React.FC = () => {
  const { flags, toggleFlag, isLoading } = useFeatureFlags();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('Feature Flags')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(flags).map(([flag, enabled]) => (
              <FeatureFlagToggle
                key={flag}
                flag={flag}
                enabled={enabled}
                onToggle={toggleFlag}
                description={t(`Feature flag for ${flag.replace(/_/g, ' ')}`)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            {t('System Health')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium">{t('API Status')}</p>
                <p className="text-sm text-gray-600">{t('Operational')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Database className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium">{t('Database')}</p>
                <p className="text-sm text-gray-600">{t('Connected')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Activity className="w-8 h-8 text-orange-500" />
              <div>
                <p className="font-medium">{t('Performance')}</p>
                <p className="text-sm text-gray-600">{t('Good')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSystemTab;
