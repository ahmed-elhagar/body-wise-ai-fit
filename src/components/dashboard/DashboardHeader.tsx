
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, TrendingUp } from "lucide-react";

const DashboardHeader = () => {
  const { profile } = useProfile();
  const { t, isRTL } = useLanguage();

  const getCurrentDate = () => {
    return new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Enhanced background with subtle animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-fitness-soft-blue to-fitness-soft-purple rounded-3xl opacity-60"></div>
      <div className="absolute inset-0 bg-card-gradient rounded-3xl backdrop-blur-sm"></div>
      
      {/* Floating decoration */}
      <div className="absolute top-4 right-6 w-24 h-24 bg-fitness-gradient rounded-full opacity-10 animate-float"></div>
      <div className="absolute bottom-4 left-6 w-16 h-16 bg-fitness-secondary rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
      
      {/* Content */}
      <div className={`relative p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex-1 space-y-4">
            {/* Date with enhanced styling */}
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-fitness-gradient rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600 font-medium bg-white/50 px-3 py-1 rounded-full">
                {getCurrentDate()}
              </span>
            </div>
            
            {/* Enhanced welcome message */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-bold bg-fitness-gradient bg-clip-text text-transparent">
                  {t('dashboard.welcome')}, {profile?.first_name || 'User'}!
                </h1>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-lg">👋</span>
                </div>
              </div>
              <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
                {t('dashboard.trackProgress')}
              </p>
            </div>

            {/* Enhanced AI generations badge */}
            {profile?.ai_generations_remaining !== undefined && (
              <div className="inline-flex items-center gap-2 bg-fitness-gradient px-4 py-2 rounded-2xl shadow-lg">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span className="text-white font-medium text-sm">
                  {t('dashboard.aiGenerationsRemaining')}: {profile.ai_generations_remaining}/5
                </span>
              </div>
            )}
          </div>

          {/* Enhanced profile section */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-fitness-gradient rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <span className="text-xs text-gray-600 font-medium">Progress</span>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:rotate-6 transition-transform">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
