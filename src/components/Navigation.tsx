
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
      <div className={`md:hidden fixed top-3 z-50 ${isRTL ? 'right-3' : 'left-3'}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white/95 backdrop-blur-sm shadow-md border-health-border hover:bg-health-soft h-8 w-8 p-0"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Compact Professional Sidebar */}
      <div className={`
        fixed top-0 h-full w-64 bg-white border-health-border z-40 transform transition-all duration-300 ease-in-out shadow-lg
        ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}
        ${isMobileMenuOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Compact Header */}
        <div className="p-3 border-b border-health-border/30">
          <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-health-primary to-health-primary/80 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h2 className={`text-lg font-bold bg-gradient-to-r from-health-primary to-health-secondary bg-clip-text text-transparent ${isRTL ? 'text-right' : 'text-left'}`}>
                FitGenius
              </h2>
            </div>
            <LanguageToggle />
          </div>
          
          {profile && (
            <div className="bg-health-soft rounded-xl p-3 border border-health-border/30">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-health-primary to-health-secondary rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{profile.first_name?.charAt(0) || 'U'}</span>
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className={`font-semibold text-health-text-primary text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{profile.first_name}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-health-accent/20 text-health-accent border-health-accent/30 text-xs px-2 py-1">
                ✨ {profile.ai_generations_remaining || 0} {t('nav.aiCallsLeft')}
              </Badge>
            </div>
          )}
        </div>

        {/* Compact Navigation Items */}
        <nav className="px-2 py-3 space-y-1 flex-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={`w-full text-sm font-medium transition-all duration-200 ${
                isActive(item.path) 
                  ? "bg-health-primary text-white shadow-md" 
                  : "text-health-text-secondary hover:bg-health-soft hover:text-health-primary"
              } ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'} rounded-lg h-9`}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
            >
              <item.icon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className="text-sm">{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* Compact Footer */}
        <div className="p-2 border-t border-health-border/30">
          <Button
            variant="ghost"
            className={`w-full text-red-600 hover:bg-red-50 hover:text-red-700 text-sm ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'} rounded-lg h-9`}
            onClick={handleSignOut}
          >
            <LogOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span className="text-sm">{t('nav.signOut')}</span>
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
