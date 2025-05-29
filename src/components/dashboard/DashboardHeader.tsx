
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
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-2xl shadow-xl">
      {/* Animated Background Pattern */}
      <div 
        className="absolute inset-0 animate-pulse-soft opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className={`relative p-4 sm:p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex-1 space-y-3">
            {/* Date & Time */}
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white/90 text-xs sm:text-sm font-medium">
                  {getCurrentDate()}
                </p>
                <p className="text-white/70 text-xs">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            {/* Welcome Message */}
            <div className="space-y-2">
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {getGreeting()}, {profile?.first_name || 'User'}!
                </h1>
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce-gentle">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
                {t('dashboard.trackProgress')}
              </p>
            </div>

            {/* AI Generations Badge */}
            {profile?.ai_generations_remaining !== undefined && (
              <div className="inline-flex">
                <Badge className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white border-0 text-xs sm:text-sm px-3 py-1.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <TrendingUp className="w-3 h-3 mr-1.5" />
                  {t('dashboard.aiGenerationsRemaining')}: {profile.ai_generations_remaining}/5
                </Badge>
              </div>
            )}
          </div>

          {/* Profile Avatar Section */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/30 backdrop-blur-sm">
                <Activity className="w-6 h-6 text-white" />
              </div>
              {/* Status Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-white font-semibold text-sm sm:text-base">
                {profile?.first_name || 'User'}
              </p>
              <p className="text-white/70 text-xs">
                Fitness Journey
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-white">12</div>
              <div className="text-white/70 text-xs font-medium">Day Streak</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-white">85%</div>
              <div className="text-white/70 text-xs font-medium">Goals Met</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-white">2.1k</div>
              <div className="text-white/70 text-xs font-medium">Calories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
