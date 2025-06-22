
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CoachMessagesTab = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          {t('Messages')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">{t('Messages feature coming soon')}</p>
          <p className="text-sm text-gray-500">
            {t('Real-time messaging with trainees will be available here')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachMessagesTab;
