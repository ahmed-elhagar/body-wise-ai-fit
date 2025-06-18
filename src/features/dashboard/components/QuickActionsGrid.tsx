
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuickActions } from "../hooks";
import { 
  UtensilsCrossed, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  ArrowRight 
} from "lucide-react";

const iconMap = {
  UtensilsCrossed,
  Dumbbell,
  Apple,
  TrendingUp
};

export const QuickActionsGrid = () => {
  const navigate = useNavigate();
  const { quickActions } = useQuickActions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickActions.map((action) => {
        const IconComponent = iconMap[action.icon as keyof typeof iconMap];
        
        return (
          <Card key={action.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{action.description}</p>
              <Button 
                onClick={() => navigate(action.href)}
                className="w-full"
                disabled={!action.isAvailable}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickActionsGrid;
