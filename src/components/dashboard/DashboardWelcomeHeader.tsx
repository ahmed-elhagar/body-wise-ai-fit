
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface DashboardWelcomeHeaderProps {
  userName: string;
  currentStreak: number;
  isPro: boolean;
}

const DashboardWelcomeHeader = ({ userName, currentStreak, isPro }: DashboardWelcomeHeaderProps) => {
  const { t } = useI18n();

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {t('dashboard:welcome', { name: userName }) || `Welcome back, ${userName}!`}
            </h1>
            <p className="text-blue-100">
              {t('dashboard:welcomeMessage') || "Let's make today count towards your fitness goals"}
            </p>
          </div>
          
          <div className="text-right space-y-2">
            {isPro && (
              <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400">
                <Crown className="w-3 h-3 mr-1" />
                {t('dashboard:proMember') || 'Pro Member'}
              </Badge>
            )}
            
            <div className="flex items-center gap-2 text-blue-100">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">
                {t('dashboard:streak', { days: currentStreak }) || `${currentStreak} day streak`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardWelcomeHeader;
