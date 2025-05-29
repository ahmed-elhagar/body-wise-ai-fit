
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
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-xl shadow-lg">
      {/* Animated Background Pattern */}
      <div 
        className="absolute inset-0 animate-pulse-soft opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className={`relative p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className="flex-1 space-y-2">
            {/* Date & Time */}
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-white/90 text-xs font-medium">
                  {getCurrentDate()}
                </p>
                <p className="text-white/70 text-xs">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            {/* Welcome Message */}
            <div className="space-y-1">
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {getGreeting()}, {profile?.first_name || 'User'}!
                </h1>
                <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce-gentle">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <p className="text-white/80 text-sm max-w-2xl leading-relaxed font-medium">
                {t('dashboard.trackProgress')}
              </p>
            </div>

            {/* AI Generations Badge */}
            {profile?.ai_generations_remaining !== undefined && (
              <div className="inline-flex">
                <Badge className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white border-0 text-xs px-2 py-1 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {t('dashboard.aiGenerationsRemaining')}: {profile.ai_generations_remaining}/5
                </Badge>
              </div>
            )}
          </div>

          {/* Profile Avatar Section */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/30 backdrop-blur-sm">
                <Activity className="w-5 h-5 text-white" />
              </div>
              {/* Status Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border border-white flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-white font-semibold text-sm">
                {profile?.first_name || 'User'}
              </p>
              <p className="text-white/70 text-xs">
                Fitness Journey
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="text-center">
              <div className="text-lg font-bold text-white">12</div>
              <div className="text-white/70 text-xs font-medium">Day Streak</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="text-center">
              <div className="text-lg font-bold text-white">85%</div>
              <div className="text-white/70 text-xs font-medium">Goals Met</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="text-center">
              <div className="text-lg font-bold text-white">2.1k</div>
              <div className="text-white/70 text-xs font-medium">Calories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
