
import { Card } from "@/components/ui/card";
import { Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const RestDayCard = () => {
  const { t } = useLanguage();

  return (
    <div className="lg:col-span-3">
      <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg text-center">
        <Coffee className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-orange-800 mb-3">
          {t('exercise.restDay') || 'Rest Day'}
        </h3>
        <p className="text-orange-700 mb-4">
          {t('exercise.restDayDescription') || 'Your muscles need time to recover and grow stronger. Use this day to:'}
        </p>
        <ul className="text-left text-orange-700 space-y-2 max-w-md mx-auto">
          <li>• {t('exercise.restTip1') || 'Get adequate sleep (7-9 hours)'}</li>
          <li>• {t('exercise.restTip2') || 'Stay hydrated throughout the day'}</li>
          <li>• {t('exercise.restTip3') || 'Do light stretching or yoga'}</li>
          <li>• {t('exercise.restTip4') || 'Focus on nutrition and meal prep'}</li>
          <li>• {t('exercise.restTip5') || 'Take a relaxing walk outdoors'}</li>
        </ul>
      </Card>
    </div>
  );
};
