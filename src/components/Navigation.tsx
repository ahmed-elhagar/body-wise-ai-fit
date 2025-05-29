
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
          className="bg-white shadow-md border-fitness-neutral-200 hover:bg-fitness-neutral-50"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Professional Sidebar */}
      <div className={`
        fixed top-0 h-full w-72 bg-white border-fitness-neutral-200 z-40 transform transition-all duration-300 ease-in-out shadow-sm
        ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}
        ${isMobileMenuOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Clean Header */}
        <div className="p-6 border-b border-fitness-neutral-100">
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-fitness-primary rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h2 className={`text-lg font-semibold text-fitness-neutral-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                FitGenius AI
              </h2>
            </div>
            <LanguageToggle />
          </div>
          
          {profile && (
            <div className="bg-fitness-neutral-50 rounded-xl p-4 border border-fitness-neutral-100">
              <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 bg-fitness-primary rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{profile.first_name?.charAt(0) || 'U'}</span>
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className={`text-xs text-fitness-neutral-600 ${isRTL ? 'text-right' : 'text-left'}`}>{t('nav.welcomeBack')}</p>
                  <p className={`font-medium text-fitness-neutral-800 ${isRTL ? 'text-right' : 'text-left'}`}>{profile.first_name}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-fitness-accent/10 text-fitness-accent border-0 text-xs">
                {profile.ai_generations_remaining || 0} {t('nav.aiCallsLeft')}
              </Badge>
            </div>
          )}
        </div>

        {/* Clean Navigation Items */}
        <nav className="px-4 py-6 space-y-1 flex-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={`w-full text-sm transition-all duration-200 ${
                isActive(item.path) 
                  ? "bg-fitness-primary text-white shadow-sm" 
                  : "text-fitness-neutral-700 hover:bg-fitness-neutral-50 hover:text-fitness-neutral-900"
              } ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'} rounded-lg h-11`}
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

        {/* Clean Footer */}
        <div className="p-4 border-t border-fitness-neutral-100 space-y-3">
          <Button
            variant="ghost"
            className={`w-full text-fitness-danger hover:bg-red-50 text-sm transition-all duration-200 ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'} rounded-lg h-11`}
            onClick={handleSignOut}
          >
            <LogOut className={`w-4 h-4 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span className="font-medium">{t('nav.signOut')}</span>
          </Button>
          <div className="text-center">
            <Settings className="w-4 h-4 mx-auto mb-1 text-fitness-neutral-400" />
            <p className="text-xs text-fitness-neutral-500 font-medium">
              {t('nav.aiPoweredFitness')}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-30 transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
