
import { useProfile } from "@/hooks/useProfile";
import { useI18n } from "@/hooks/useI18n";
import { Badge } from "@/components/ui/badge";
import { Calendar, Activity, Sparkles, TrendingUp, Clock } from "lucide-react";

const DashboardHeader = () => {
  const { profile } = useProfile();
  const { tFrom, isRTL } = useI18n();
  const tDashboard = tFrom('dashboard');

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
    if (hour < 12) return String(tDashboard('goodMorning'));
    if (hour < 17) return String(tDashboard('goodAfternoon'));
    return String(tDashboard('goodEvening'));
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-2xl shadow-xl">
      {/* Animated Background Pattern */}
      <div 
        className="absolute inset-0 animate-pulse-soft opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className={`relative p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex-1 space-y-3">
            {/* Date & Time */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-semibold">
                  {getCurrentDate()}
                </p>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Clock className="w-3 h-3 text-white/70" />
                  <p className="text-white/70 text-xs">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Welcome Message */}
            <div className="space-y-2">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {getGreeting()}, {profile?.first_name || String(tDashboard('user'))}!
                </h1>
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce-gentle">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="text-white/85 text-base max-w-2xl leading-relaxed font-medium">
                {String(tDashboard('trackProgress'))}
              </p>
            </div>

            {/* AI Generations Badge */}
            {profile?.ai_generations_remaining !== undefined && (
              <div className="inline-flex">
                <Badge className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white border-0 text-sm px-3 py-1.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {String(tDashboard('aiGenerationsRemaining'))}: {profile.ai_generations_remaining}/5
                </Badge>
              </div>
            )}
          </div>

          {/* Profile Avatar Section */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30 backdrop-blur-sm">
                <Activity className="w-7 h-7 text-white" />
              </div>
              {/* Status Indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-white font-bold text-base">
                {profile?.first_name || String(tDashboard('user'))}
              </p>
              <p className="text-white/80 text-sm">
                {String(tDashboard('fitnessJourney'))}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row - Enhanced */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/25 hover:bg-white/20 transition-all duration-300">
            <div className="text-center">
              <div className="text-xl font-bold text-white">12</div>
              <div className="text-white/80 text-xs font-medium">{String(tDashboard('dayStreak'))}</div>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/25 hover:bg-white/20 transition-all duration-300">
            <div className="text-center">
              <div className="text-xl font-bold text-white">85%</div>
              <div className="text-white/80 text-xs font-medium">{String(tDashboard('goalsMet'))}</div>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/25 hover:bg-white/20 transition-all duration-300">
            <div className="text-center">
              <div className="text-xl font-bold text-white">2.1k</div>
              <div className="text-white/80 text-xs font-medium">{String(tDashboard('calories'))}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
