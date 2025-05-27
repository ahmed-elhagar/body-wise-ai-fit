
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  User, 
  Utensils, 
  Dumbbell, 
  Scale, 
  Camera,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Utensils, label: "Meal Plan", path: "/meal-plan" },
    { icon: Dumbbell, label: "Exercise", path: "/exercise" },
    { icon: Scale, label: "Weight", path: "/weight-tracking" },
    { icon: Camera, label: "Food Log", path: "/calorie-checker" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/90 backdrop-blur-sm"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-fitness-gradient rounded-full flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">FitGenius</h1>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive(item.path) 
                    ? "bg-fitness-gradient text-white" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
