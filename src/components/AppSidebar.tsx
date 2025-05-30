
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Home,
  UtensilsCrossed,
  Dumbbell,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user has admin role
  const { data: hasAdminRole } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
      
      return !error && data;
    },
    enabled: !!user?.id
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: Home },
    { name: t('nav.mealPlan'), href: '/meal-plan', icon: UtensilsCrossed },
    { name: t('nav.exercise'), href: '/exercise', icon: Dumbbell },
    { name: t('nav.progress'), href: '/progress', icon: TrendingUp },
    { name: t('nav.profile'), href: '/profile', icon: User },
  ];

  if (hasAdminRole) {
    navigation.push({ name: t('nav.adminPanel'), href: '/admin', icon: Settings });
  }

  return (
    <Sidebar side={isRTL ? "right" : "left"} className="border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 p-4 bg-white">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">FG</span>
            </div>
            <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
              <span className={`font-bold text-lg text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                {t('common.appName')}
              </span>
              <span className={`text-xs text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                {t('nav.aiPoweredFitness')}
              </span>
            </div>
          </div>
          <SidebarTrigger className="lg:hidden" />
        </div>
        
        {/* User Info - Desktop only */}
        <div className="hidden lg:block mt-4">
          {user && (
            <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className={`flex flex-col min-w-0 flex-1 ${isRTL ? 'items-end' : 'items-start'}`}>
                <span className={`font-semibold text-sm text-gray-800 truncate ${isRTL ? 'font-arabic' : ''}`}>
                  {t('nav.welcomeBack')}
                </span>
                <span className={`text-xs text-gray-600 truncate ${isRTL ? 'text-right' : 'text-left'}`}>
                  {user.email}
                </span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 bg-white">
        <SidebarMenu>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  onClick={() => navigate(item.href)}
                  isActive={isActive}
                  className={`w-full mb-1 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  } ${isRTL ? 'justify-end flex-row-reverse font-arabic' : 'justify-start'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4 bg-white">
        <SidebarMenu>
          {hasAdminRole && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate('/admin')}
                className={`w-full text-yellow-700 hover:bg-yellow-50 mb-1 ${
                  isRTL ? 'justify-end flex-row-reverse font-arabic' : 'justify-start'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>{t('nav.adminPanel')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className={`w-full text-red-600 hover:bg-red-50 ${
                isRTL ? 'justify-end flex-row-reverse font-arabic' : 'justify-start'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span>{t('nav.signOut')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
