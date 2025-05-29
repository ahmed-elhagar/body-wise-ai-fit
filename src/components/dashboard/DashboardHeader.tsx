
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar } from "lucide-react";

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
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-fitness-primary/10 via-purple-50 to-pink-50 rounded-3xl"></div>
      
      {/* Content */}
      <div className={`relative p-6 sm:p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className="flex-1">
            {/* Date */}
            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-4 h-4 text-fitness-primary" />
              <span className="text-sm text-gray-600">{getCurrentDate()}</span>
            </div>
            
            {/* Welcome message */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-fitness-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {t('dashboard.welcome')}, {profile?.first_name || 'User'}! 👋
              </h1>
              <p className="text-gray-600 text-sm sm:text-base max-w-md">
                {t('dashboard.trackProgress')}
              </p>
            </div>

            {/* AI generations remaining */}
            {profile?.ai_generations_remaining !== undefined && (
              <Badge className="bg-gradient-to-r from-fitness-primary to-purple-600 text-white border-0 px-4 py-2">
                <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('dashboard.aiGenerationsRemaining')}: {profile.ai_generations_remaining}/5
              </Badge>
            )}
          </div>

          {/* Profile avatar section */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-fitness-gradient rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl sm:text-3xl">🏆</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
