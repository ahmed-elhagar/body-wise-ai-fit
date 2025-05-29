
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Calendar, Activity, Sparkles, TrendingUp } from "lucide-react";

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 17) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-3xl shadow-2xl">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse-soft"></div>
      
      <div className={`relative p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex-1 space-y-5">
            {/* Date & Time */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">
                  {getCurrentDate()}
                </p>
                <p className="text-white/70 text-xs">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            {/* Welcome Message */}
            <div className="space-y-3">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {getGreeting()}, {profile?.first_name || 'User'}!
                </h1>
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce-gentle">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-white/80 text-lg max-w-2xl leading-relaxed font-medium">
                {t('dashboard.trackProgress')}
              </p>
            </div>

            {/* AI Generations Badge */}
            {profile?.ai_generations_remaining !== undefined && (
              <div className="inline-flex">
                <Badge className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white border-0 text-sm px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {t('dashboard.aiGenerationsRemaining')}: {profile.ai_generations_remaining}/5
                </Badge>
              </div>
            )}
          </div>

          {/* Profile Avatar Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white/30 backdrop-blur-sm">
                <Activity className="w-8 h-8 text-white" />
              </div>
              {/* Status Indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-3 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-white font-semibold text-lg">
                {profile?.first_name || 'User'}
              </p>
              <p className="text-white/70 text-sm">
                Fitness Journey
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-white/70 text-xs font-medium">Day Streak</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">85%</div>
              <div className="text-white/70 text-xs font-medium">Goals Met</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">2.1k</div>
              <div className="text-white/70 text-xs font-medium">Calories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
