
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
  LogOut
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
    navigationItems.push({ icon: Shield, label: t('nav.adminPanel'), path: "/admin-panel" });
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
          className="bg-white/90 backdrop-blur-sm"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar - Fixed positioning with RTL support */}
      <div className={`
        fixed top-0 h-full w-64 bg-white/95 backdrop-blur-sm border-gray-200 z-40 transform transition-transform duration-300 ease-in-out
        ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}
        ${isMobileMenuOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-4 sm:p-6">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className={`text-xl sm:text-2xl font-bold bg-fitness-gradient bg-clip-text text-transparent ${isRTL ? 'text-right' : 'text-left'}`}>
              FitGenius AI
            </h2>
            {/* Language Toggle - Prominent placement */}
            <div className="bg-white shadow-sm rounded-lg p-1">
              <LanguageToggle />
            </div>
          </div>
          {profile && (
            <div className="mt-3 sm:mt-4 p-3 bg-fitness-gradient rounded-lg text-white">
              <p className={`text-sm opacity-90 ${isRTL ? 'text-right' : 'text-left'}`}>{t('nav.welcomeBack')}</p>
              <p className={`font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{profile.first_name}</p>
              <div className={`flex items-center mt-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                  {profile.ai_generations_remaining || 0} {t('nav.aiCallsLeft')}
                </Badge>
              </div>
            </div>
          )}
        </div>

        <nav className="px-3 sm:px-4 space-y-1 sm:space-y-2 flex-1">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full text-sm sm:text-base ${
                isActive(item.path) 
                  ? "bg-fitness-gradient text-white hover:opacity-90" 
                  : "hover:bg-gray-100"
              } ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
            >
              <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-3 right-3 sm:left-4 sm:right-4 space-y-2">
          <Button
            variant="ghost"
            className={`w-full text-red-600 hover:bg-red-50 text-sm sm:text-base ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}
            onClick={handleSignOut}
          >
            <LogOut className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            {t('nav.signOut')}
          </Button>
          <div className="p-2 sm:p-3 bg-gray-50 rounded-lg text-center">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2 text-gray-600" />
            <p className="text-xs text-gray-600">
              {t('nav.aiPoweredFitness')}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
