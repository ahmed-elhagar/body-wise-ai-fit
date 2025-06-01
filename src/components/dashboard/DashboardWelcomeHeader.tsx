import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/useI18n";

interface DashboardWelcomeHeaderProps {
  userName?: string;
  streak?: number;
  totalWorkouts?: number;
}

const DashboardWelcomeHeader = ({ userName, streak = 0, totalWorkouts = 0 }: DashboardWelcomeHeaderProps) => {
  const { t, isRTL } = useI18n();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="p-6">
        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('Welcome')}, {userName || t('Guest')}!
            </h2>
            <p className="text-gray-600">
              {t('dashboard.startYourDay')}
            </p>
          </div>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            {t('Premium')}
          </Badge>
        </div>

        <div className={`grid grid-cols-2 gap-4 mt-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div>
            <p className="text-sm text-gray-500">{t('Streak')}</p>
            <p className="text-lg font-semibold text-gray-800">{streak} {t('days')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('Total Workouts')}</p>
            <p className="text-lg font-semibold text-gray-800">{totalWorkouts}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardWelcomeHeader;
