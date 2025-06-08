
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Activity, 
  Target, 
  TrendingUp 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActionsGrid = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Meal Plan",
      description: "View today's meals",
      icon: Calendar,
      color: "from-green-500 to-emerald-600",
      onClick: () => navigate('/meal-plan')
    },
    {
      title: "Workouts",
      description: "Start exercising",
      icon: Activity,
      color: "from-blue-500 to-cyan-600",
      onClick: () => navigate('/exercise')
    },
    {
      title: "Goals",
      description: "Track progress",
      icon: Target,
      color: "from-purple-500 to-violet-600",
      onClick: () => navigate('/goals')
    },
    {
      title: "Progress",
      description: "View analytics",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      onClick: () => navigate('/progress')
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <Card 
            key={action.title}
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
            onClick={action.onClick}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-xs text-gray-600">{action.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickActionsGrid;
