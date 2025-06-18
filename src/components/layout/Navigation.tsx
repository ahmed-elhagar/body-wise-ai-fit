
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  UtensilsCrossed, 
  Dumbbell, 
  User, 
  Users,
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const Navigation = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useLanguage();

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: t('Dashboard') },
    { path: '/meal-plan', icon: UtensilsCrossed, label: t('Meal Plan') },
    { path: '/exercise', icon: Dumbbell, label: t('Exercise') },
    { path: '/profile', icon: User, label: t('Profile') },
    { path: '/coach', icon: Users, label: t('Coach') },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FF</span>
              </div>
              <span className="text-xl font-bold text-gray-900">FitFatta AI</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{t('Sign Out')}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
