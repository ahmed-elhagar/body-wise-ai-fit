
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Scale, Settings, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/shared/hooks/useI18n";

export const ProfileQuickActions = () => {
  const navigate = useNavigate();
  const { tFrom, isRTL } = useI18n();
  const tProfile = tFrom('profile');

  const actions = [
    {
      title: String(tProfile('updateGoals')),
      description: String(tProfile('updateGoalsDesc')),
      icon: Target,
      action: () => navigate('/goals'),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: String(tProfile('trackWeight')),
      description: String(tProfile('trackWeightDesc')),
      icon: Scale,
      action: () => navigate('/weight-tracking'),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: String(tProfile('viewProgress')),
      description: String(tProfile('viewProgressDesc')),
      icon: TrendingUp,
      action: () => navigate('/progress'),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: String(tProfile('settings')),
      description: String(tProfile('settingsDesc')),
      icon: Settings,
      action: () => navigate('/settings'),
      color: "bg-gray-500 hover:bg-gray-600"
    }
  ];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className={`text-lg ${isRTL ? 'font-arabic text-right' : ''}`}>
          {String(tProfile('quickActions'))}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.title}
                variant="ghost"
                className={`h-auto p-3 flex flex-col items-center text-center hover:bg-gray-50 ${isRTL ? 'font-arabic' : ''}`}
                onClick={action.action}
              >
                <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className={`text-xs font-medium text-gray-700 ${isRTL ? 'text-center' : ''}`}>
                  {action.title}
                </div>
                <div className={`text-xs text-gray-500 ${isRTL ? 'text-center' : ''}`}>
                  {action.description}
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
