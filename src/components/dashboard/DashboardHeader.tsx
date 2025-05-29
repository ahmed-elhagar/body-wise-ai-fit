
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Calendar, Activity } from "lucide-react";

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
    <div className="bg-white rounded-2xl border border-fitness-neutral-100 shadow-sm">
      <div className={`p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex-1 space-y-4">
            {/* Date */}
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-6 h-6 bg-fitness-neutral-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-3 h-3 text-fitness-neutral-600" />
              </div>
              <span className="text-sm text-fitness-neutral-600 font-medium">
                {getCurrentDate()}
              </span>
            </div>
            
            {/* Welcome message */}
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-semibold text-fitness-neutral-800">
                {t('dashboard.welcome')}, {profile?.first_name || 'User'}!
              </h1>
              <p className="text-fitness-neutral-600 text-base max-w-2xl leading-relaxed">
                {t('dashboard.trackProgress')}
              </p>
            </div>

            {/* AI generations badge */}
            {profile?.ai_generations_remaining !== undefined && (
              <Badge className="bg-fitness-accent/10 text-fitness-accent border-fitness-accent/20 text-sm px-3 py-1">
                {t('dashboard.aiGenerationsRemaining')}: {profile.ai_generations_remaining}/5
              </Badge>
            )}
          </div>

          {/* Profile section */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-fitness-primary rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
