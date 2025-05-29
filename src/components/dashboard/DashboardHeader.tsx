
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
      {/* Background gradient - more subtle */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 rounded-xl"></div>
      
      {/* Content */}
      <div className={`relative p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className="flex-1">
            {/* Date */}
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs text-gray-600">{getCurrentDate()}</span>
            </div>
            
            {/* Welcome message */}
            <div className="mb-3">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                {t('dashboard.welcome')}, {profile?.first_name || 'User'}! 👋
              </h1>
              <p className="text-gray-600 text-sm max-w-md">
                {t('dashboard.trackProgress')}
              </p>
            </div>

            {/* AI generations remaining */}
            {profile?.ai_generations_remaining !== undefined && (
              <Badge className="bg-blue-500 text-white border-0 px-2 py-1 text-xs">
                <Sparkles className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {t('dashboard.aiGenerationsRemaining')}: {profile.ai_generations_remaining}/5
              </Badge>
            )}
          </div>

          {/* Profile avatar section - smaller */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-lg">🏆</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
