
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
    { icon: Home, label: t('nav.dashboard'), path: "/dashboard" },
    { icon: Utensils, label: t('nav.mealPlan'), path: "/meal-plan" },
    { icon: Dumbbell, label: t('nav.exercise'), path: "/exercise" },
    { icon: Scale, label: t('nav.weightTracking'), path: "/weight-tracking" },
    { icon: Camera, label: t('nav.calorieChecker'), path: "/calorie-checker" },
    { icon: MessageCircle, label: t('nav.aiChat'), path: "/ai-chat" },
    { icon: User, label: t('nav.profile'), path: "/profile" },
  ];

  if (isAdmin) {
    navigationItems.push({ 
      icon: Shield, 
      label: t('nav.adminPanel'), 
      path: "/admin-panel"
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
          className="bg-white/95 backdrop-blur-sm shadow-lg border-health-border hover:bg-health-soft"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Enhanced Professional Sidebar */}
      <div className={`
        fixed top-0 h-full w-72 bg-gradient-to-b from-white to-health-soft/30 border-health-border z-40 transform transition-all duration-300 ease-in-out shadow-xl backdrop-blur-sm
        ${isRTL ? 'right-0 border-l-2' : 'left-0 border-r-2'}
        ${isMobileMenuOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Enhanced Header */}
        <div className="p-6 border-b-2 border-health-border/20 bg-white/80 backdrop-blur-sm">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-health-primary to-health-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h2 className={`text-xl font-bold bg-gradient-to-r from-health-primary to-health-secondary bg-clip-text text-transparent ${isRTL ? 'text-right' : 'text-left'}`}>
                FitGenius AI
              </h2>
            </div>
            <LanguageToggle />
          </div>
          
          {profile && (
            <div className="bg-gradient-to-br from-health-soft to-white rounded-2xl p-5 border-2 border-health-border/30 shadow-sm">
              <div className={`flex items-center gap-4 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-health-primary to-health-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-base font-bold text-white">{profile.first_name?.charAt(0) || 'U'}</span>
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className={`text-sm text-health-text-secondary font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('nav.welcomeBack')}</p>
                  <p className={`font-bold text-health-text-primary text-lg ${isRTL ? 'text-right' : 'text-left'}`}>{profile.first_name}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-health-accent/20 to-health-accent/10 text-health-accent border-health-accent/30 text-sm font-semibold px-3 py-1.5">
                ✨ {profile.ai_generations_remaining || 0} {t('nav.aiCallsLeft')}
              </Badge>
            </div>
          )}
        </div>

        {/* Enhanced Navigation Items */}
        <nav className="px-4 py-6 space-y-2 flex-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={`w-full text-sm font-semibold transition-all duration-300 group ${
                isActive(item.path) 
                  ? "bg-gradient-to-r from-health-primary to-health-primary/90 text-white shadow-lg shadow-health-primary/25 scale-[1.02]" 
                  : "text-health-text-secondary hover:bg-gradient-to-r hover:from-health-soft hover:to-white hover:text-health-primary hover:shadow-md border-2 border-transparent hover:border-health-border/30"
              } ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'} rounded-xl h-12 relative overflow-hidden`}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
            >
              <item.icon className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'} transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-semibold">{item.label}</span>
              {isActive(item.path) && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              )}
            </Button>
          ))}
        </nav>

        {/* Enhanced Footer */}
        <div className="p-4 border-t-2 border-health-border/20 bg-white/80 backdrop-blur-sm space-y-4">
          <Button
            variant="ghost"
            className={`w-full text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 text-sm font-semibold transition-all duration-300 border-2 border-transparent hover:border-red-200 ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'} rounded-xl h-12`}
            onClick={handleSignOut}
          >
            <LogOut className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span className="font-semibold">{t('nav.signOut')}</span>
          </Button>
          <div className="text-center bg-gradient-to-r from-health-soft to-white rounded-xl p-3 border border-health-border/30">
            <Settings className="w-5 h-5 mx-auto mb-2 text-health-primary" />
            <p className="text-xs text-health-text-secondary font-bold">
              {t('nav.aiPoweredFitness')}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-health-text-primary/20 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
