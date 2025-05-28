
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Utensils, label: "Meal Plan", path: "/meal-plan" },
    { icon: Dumbbell, label: "Exercise", path: "/exercise" },
    { icon: Scale, label: "Weight Tracking", path: "/weight-tracking" },
    { icon: Camera, label: "Calorie Checker", path: "/calorie-checker" },
    { icon: MessageCircle, label: "AI Chat", path: "/ai-chat" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  if (isAdmin) {
    navigationItems.push({ icon: Shield, label: "Admin Panel", path: "/admin" });
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
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white/90 backdrop-blur-sm"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar - Fixed positioning */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-fitness-gradient bg-clip-text text-transparent">
            FitGenius AI
          </h2>
          {profile && (
            <div className="mt-4 p-3 bg-fitness-gradient rounded-lg text-white">
              <p className="text-sm opacity-90">Welcome back!</p>
              <p className="font-semibold">{profile.first_name}</p>
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {profile.ai_generations_remaining || 0} AI calls left
                </Badge>
              </div>
            </div>
          )}
        </div>

        <nav className="px-4 space-y-2 flex-1">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive(item.path) 
                  ? "bg-fitness-gradient text-white hover:opacity-90" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <Settings className="w-5 h-5 mx-auto mb-2 text-gray-600" />
            <p className="text-xs text-gray-600">
              AI-Powered Fitness Companion
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
