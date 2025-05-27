
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Scale, 
  Utensils, 
  Dumbbell, 
  Camera, 
  Target,
  Calendar
} from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Scale,
      title: "Log Weight",
      description: "Track your progress",
      color: "bg-blue-500",
      action: () => navigate('/weight-tracking')
    },
    {
      icon: Camera,
      title: "Log Food",
      description: "Check calories",
      color: "bg-green-500",
      action: () => navigate('/calorie-checker')
    },
    {
      icon: Utensils,
      title: "Meal Plan",
      description: "View weekly meals",
      color: "bg-orange-500",
      action: () => navigate('/meal-plan')
    },
    {
      icon: Dumbbell,
      title: "Workout",
      description: "Start exercising",
      color: "bg-purple-500",
      action: () => navigate('/exercise')
    },
    {
      icon: Target,
      title: "Update Goals",
      description: "Modify your targets",
      color: "bg-red-500",
      action: () => navigate('/profile')
    },
    {
      icon: Calendar,
      title: "Schedule",
      description: "Plan your week",
      color: "bg-indigo-500",
      action: () => navigate('/dashboard')
    }
  ];

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
            onClick={action.action}
          >
            <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">{action.title}</p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
