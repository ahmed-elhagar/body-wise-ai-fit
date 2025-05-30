
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
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
  Menu,
  X,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

const Sidebar = () => {
  const { user, signOut } = useAuth();
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const navigation = [
    { name: t('dashboard'), href: '/dashboard', icon: Home },
    { name: t('mealPlan'), href: '/meal-plan', icon: UtensilsCrossed },
    { name: t('exercise'), href: '/exercise', icon: Dumbbell },
    { name: t('progress'), href: '/progress', icon: TrendingUp },
    { name: t('profile'), href: '/profile', icon: User },
  ];

  // Add admin link if user is admin
  if (hasAdminRole) {
    navigation.push({ name: 'Admin', href: '/admin', icon: Settings });
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 ${isRTL ? 'lg:right-0' : 'lg:left-0'} ${isCollapsed ? 'lg:w-16' : 'lg:w-64'} bg-white border-${isRTL ? 'l' : 'r'} border-gray-200 transition-all duration-300 ease-in-out z-40`}>
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : isRTL ? 'justify-end' : 'justify-between'} h-16 px-4 border-b border-gray-200`}>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-gray-900 truncate">
                FitGenius
              </h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2"
            >
              {isCollapsed ? (
                isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              ) : (
                isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? '' : isRTL ? 'ml-3' : 'mr-3'}`} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            {!isCollapsed && user && (
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={`${isRTL ? 'mr-3' : 'ml-3'} min-w-0 flex-1`}>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={signOut}
              className={`w-full ${isRTL ? 'flex-row-reverse' : ''} ${isCollapsed ? 'px-2' : 'justify-start'}`}
              title={isCollapsed ? t('signOut') : undefined}
            >
              <LogOut className={`w-4 h-4 ${isCollapsed ? '' : isRTL ? 'ml-2' : 'mr-2'}`} />
              {!isCollapsed && t('signOut')}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Mobile navigation will be handled by Layout component */}
      </div>
    </>
  );
};

export default Sidebar;
