
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Utensils, Dumbbell } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface DashboardWelcomeHeaderProps {
  userName: string;
}

const DashboardWelcomeHeader = ({ userName }: DashboardWelcomeHeaderProps) => {
  const { t, isRTL } = useI18n();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard:goodMorning');
    if (hour < 18) return t('dashboard:goodAfternoon');
    return t('dashboard:goodEvening');
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className={`text-2xl lg:text-3xl font-bold mb-2 ${isRTL ? 'font-arabic' : ''}`}>
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-blue-100 text-sm lg:text-base">
            {t('dashboard:welcome')}
          </p>
        </div>
        
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
            <Utensils className="w-4 h-4 mr-2" />
            {t('navigation:mealPlan')}
          </Button>
          <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
            <Dumbbell className="w-4 h-4 mr-2" />
            {t('navigation:exercise')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DashboardWelcomeHeader;
