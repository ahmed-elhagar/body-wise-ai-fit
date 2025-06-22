
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CoachAnalyticsTab = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {t('Analytics')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">{t('Analytics dashboard coming soon')}</p>
          <p className="text-sm text-gray-500">
            {t('Detailed analytics and insights about your trainees will be available here')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachAnalyticsTab;
