
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import {
  Home,
  User,
  Utensils,
  Dumbbell,
  Scale,
  Camera,
  MessageCircle,
  Settings,
  Menu,
  X,
  Shield,
  LogOut,
  Sparkles,
  Activity
} from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();
  const { profile } = useProfile();
  const { t, isRTL } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { icon: Home, label: t('nav.dashboard'), path: "/dashboard", color: "text-blue-600", bgColor: "hover:bg-blue-50" },
    { icon: Utensils, label: t('nav.mealPlan'), path: "/meal-plan", color: "text-green-600", bgColor: "hover:bg-green-50" },
    { icon: Dumbbell, label: t('nav.exercise'), path: "/exercise", color: "text-purple-600", bgColor: "hover:bg-purple-50" },
    { icon: Scale, label: t('nav.weightTracking'), path: "/weight-tracking", color: "text-orange-600", bgColor: "hover:bg-orange-50" },
    { icon: Camera, label: t('nav.calorieChecker'), path: "/calorie-checker", color: "text-red-600", bgColor: "hover:bg-red-50" },
    { icon: MessageCircle, label: t('nav.aiChat'), path: "/ai-chat", color: "text-indigo-600", bgColor: "hover:bg-indigo-50" },
    { icon: User, label: t('nav.profile'), path: "/profile", color: "text-gray-600", bgColor: "hover:bg-gray-50" },
  ];

  if (isAdmin) {
    navigationItems.push({ 
      icon: Shield, 
      label: t('nav.adminPanel'), 
      path: "/admin-panel", 
      color: "text-amber-600", 
      bgColor: "hover:bg-amber-50" 
    });
  }

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className={`md:hidden fixed top-4 z-50 ${isRTL ? 'right-4' : 'left-4'}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white/95 backdrop-blur-md shadow-lg border-gray-200/50 hover:bg-gray-50"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Enhanced Sidebar */}
      <div className={`
        fixed top-0 h-full w-72 bg-white/95 backdrop-blur-xl border-gray-200/50 z-40 transform transition-all duration-300 ease-in-out shadow-xl
        ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}
        ${isMobileMenuOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Header with gradient */}
        <div className="relative p-6 bg-gradient-to-br from-fitness-primary via-fitness-secondary to-fitness-accent overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className={`relative flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h2 className={`text-xl font-bold text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                FitGenius AI
              </h2>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1">
              <LanguageToggle />
            </div>
          </div>
          
          {profile && (
            <div className="relative bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">{profile.first_name?.charAt(0) || 'U'}</span>
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className={`text-sm opacity-90 text-white ${isRTL ? 'text-right' : 'text-left'}`}>{t('nav.welcomeBack')}</p>
                  <p className={`font-semibold text-white ${isRTL ? 'text-right' : 'text-left'}`}>{profile.first_name}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <Badge variant="secondary" className="bg-white/25 text-white border-0 text-xs backdrop-blur-sm">
                  {profile.ai_generations_remaining || 0} {t('nav.aiCallsLeft')}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="px-4 space-y-2 mt-4 flex-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full text-sm transition-all duration-200 ${
                isActive(item.path) 
                  ? "bg-fitness-gradient text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]" 
                  : `hover:bg-gray-50 ${item.color} ${item.bgColor} hover:shadow-md`
              } ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'} rounded-xl h-12`}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
            >
              <item.icon className={`w-4 h-4 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <span className="font-medium">{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 bg-gradient-to-t from-gray-50/90 to-transparent backdrop-blur-sm">
          <Button
            variant="ghost"
            className={`w-full text-red-600 hover:bg-red-50 text-sm transition-all duration-200 hover:shadow-md ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'} rounded-xl h-11`}
            onClick={handleSignOut}
          >
            <LogOut className={`w-4 h-4 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span className="font-medium">{t('nav.signOut')}</span>
          </Button>
          <div className="p-3 bg-gradient-to-br from-gray-100/80 to-gray-50/80 rounded-xl text-center backdrop-blur-sm border border-gray-200/50">
            <Settings className="w-4 h-4 mx-auto mb-2 text-gray-600" />
            <p className="text-xs text-gray-600 font-medium">
              {t('nav.aiPoweredFitness')}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
