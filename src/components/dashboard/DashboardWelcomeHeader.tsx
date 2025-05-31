
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Sparkles } from "lucide-react";

interface DashboardWelcomeHeaderProps {
  userName: string;
  onViewMealPlan: () => void;
  onViewExercise: () => void;
}

export const DashboardWelcomeHeader = ({ userName }: DashboardWelcomeHeaderProps) => {
  const { t, isRTL } = useLanguage();

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('Good morning');
    if (hour < 17) return t('Good afternoon');
    return t('Good evening');
  };

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 border-0 shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
      
      <div className={`relative p-6 md:p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className="flex-1">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {getCurrentTimeGreeting()}, {userName}! 👋
              </h1>
            </div>
            
            <p className="text-white/90 text-base md:text-lg font-medium mb-4">
              {t('Welcome back to your fitness journey')}
            </p>
            
            <div className={`flex items-center gap-2 text-white/80 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{currentDate}</span>
            </div>
          </div>
          
          {/* Motivational Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 mb-2">
                <span className="text-white font-bold">🎯</span>
              </div>
              <p className="text-white/80 text-xs font-medium">{t('Stay Focused')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 mb-2">
                <span className="text-white font-bold">💪</span>
              </div>
              <p className="text-white/80 text-xs font-medium">{t('Keep Going')}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
