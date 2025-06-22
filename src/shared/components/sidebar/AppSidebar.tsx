import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Utensils, 
  Dumbbell, 
  BarChart3, 
  Target,
  MessageSquare,
  Calendar,
  User,
  Camera,
  Scale,
  Settings,
  ChefHat,
  Crown,
  LogOut,
  LucideIcon,
  Shield,
  Users,
  Activity,
  TrendingUp,
  Apple,
  Zap,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRole } from "@/shared/hooks/useRole";
import { useI18n } from "@/shared/hooks/useI18n";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  icon: LucideIcon;
  label: string;
  category: 'dashboard' | 'nutrition' | 'fitness' | 'tracking' | 'ai';
  badge?: string;
}

export function AppSidebar() {
  const { t, isRTL } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin, isCoach, role } = useRole();

  const navigationItems: NavigationItem[] = [
    // Dashboard
    { href: "/dashboard", icon: Home, label: "Dashboard", category: 'dashboard' },
    
    // Nutrition Management
    { href: "/meal-plan", icon: Utensils, label: "Meal Plans", category: 'nutrition' },
    { href: "/food-tracker", icon: Calendar, label: "Food Diary", category: 'nutrition' },
    
    // Fitness & Exercise
    { href: "/exercise", icon: Dumbbell, label: "Workouts", category: 'fitness' },
    { href: "/goals", icon: Target, label: "Fitness Goals", category: 'fitness' },
    
    // Progress & Analytics
    { href: "/progress", icon: BarChart3, label: "Progress Reports", category: 'tracking' },
    { href: "/weight-tracking", icon: Scale, label: "Weight Tracking", category: 'tracking' },
    
    // AI & Intelligence
    { href: "/chat", icon: MessageSquare, label: "AI Coach", category: 'ai', badge: "PRO" },
  ];

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  const categoryLabels = {
    dashboard: "Overview",
    nutrition: "Nutrition Management", 
    fitness: "Fitness & Exercise",
    tracking: "Progress & Analytics",
    ai: "AI Intelligence"
  };

  const categoryIcons: Record<string, LucideIcon> = {
    dashboard: Home,
    nutrition: Apple,
    fitness: Dumbbell,
    tracking: TrendingUp,
    ai: Brain
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'coach': return 'bg-purple-100 text-purple-800';
      case 'pro': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-64 bg-white shadow-2xl border-r border-brand-neutral-200 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-brand-neutral-200 bg-gradient-to-r from-brand-primary-50 to-brand-secondary-50">
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-brand-neutral-900">FitFatta</h2>
            <p className="text-sm text-brand-neutral-600">Smart Nutrition</p>
          </div>
        </Link>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {Object.entries(groupedItems).map(([category, items]) => {
          const CategoryIcon = categoryIcons[category];
          
          return (
            <div key={category} className="space-y-2">
              {/* Category Header */}
              <div className="flex items-center space-x-2 px-2 mb-3">
                <CategoryIcon className="h-4 w-4 text-brand-neutral-500" />
                <span className="text-xs font-semibold text-brand-neutral-500 uppercase tracking-wider">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </span>
              </div>

              {/* Category Items */}
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                        isActive
                          ? "bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white shadow-lg"
                          : "text-brand-neutral-700 hover:bg-brand-neutral-100"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={cn(
                          "h-5 w-5 transition-transform group-hover:scale-110",
                          isActive ? "text-white" : "text-brand-neutral-600"
                        )} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium",
                          isActive 
                            ? "bg-white/20 text-white" 
                            : "bg-brand-primary-100 text-brand-primary-700"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Pro Upgrade Section */}
      {role !== 'pro' && role !== 'admin' && (
        <div className="p-4">
          <div className="bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-xl p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="h-4 w-4" />
              <span className="font-medium text-sm">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-white/80 mb-3">Unlock AI coaching and advanced analytics</p>
            <Button
              onClick={() => navigate('/pro')}
              className="w-full bg-white/20 hover:bg-white/30 text-white border-0 text-sm py-2"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced User Profile Section */}
      <div className="p-4 border-t border-brand-neutral-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full p-3 h-auto">
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-brand-neutral-900 truncate">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      getRoleBadgeColor()
                    )}>
                      {role?.charAt(0).toUpperCase() + role?.slice(1) || 'Free'}
                    </span>
                  </div>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className="w-56 p-2 bg-white/95 backdrop-blur-md border border-neutral-200/50 shadow-xl rounded-xl"
            sideOffset={8}
          >
            {/* User Info Header */}
            <div className="p-3 border-b border-neutral-100 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-accent-400 to-brand-accent-600 rounded-full flex items-center justify-center text-white font-bold">
                  {(user?.email?.[0] || 'U').toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-neutral-900">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Profile & Settings */}
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="w-4 h-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>

            {/* Role-based Access */}
            {(isAdmin || isCoach) && (
              <>
                <DropdownMenuSeparator />
                
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                
                {isCoach && (
                  <DropdownMenuItem onClick={() => navigate('/coach')}>
                    <Users className="w-4 h-4 mr-2" />
                    Coach Panel
                  </DropdownMenuItem>
                )}
              </>
            )}

            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
