
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Camera, 
  Plus, 
  PlayCircle, 
  Scale, 
  BookOpen, 
  MessageSquare,
  Timer,
  Target,
  Utensils,
  Dumbbell,
  Brain,
  Calendar
} from "lucide-react";

const EnhancedQuickActions = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const quickActions = [
    {
      title: 'Log Weight',
      description: 'Track your progress',
      icon: Scale,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      action: () => navigate('/weight-tracking'),
      badge: 'Quick'
    },
    {
      title: 'Start Workout',
      description: 'Begin today\'s session',
      icon: PlayCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      action: () => navigate('/exercise'),
      badge: 'Ready'
    },
    {
      title: 'Photo Analysis',
      description: 'Analyze your meal',
      icon: Camera,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      action: () => navigate('/calorie-checker'),
      badge: 'AI'
    },
    {
      title: 'AI Chat',
      description: 'Get personalized advice',
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      action: () => navigate('/ai-chat'),
      badge: 'Smart'
    },
    {
      title: 'Meal Plan',
      description: 'View today\'s meals',
      icon: Utensils,
      color: 'from-amber-500 to-yellow-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      action: () => navigate('/meal-plan'),
      badge: 'Today'
    },
    {
      title: 'Workout Timer',
      description: 'Track exercise time',
      icon: Timer,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      action: () => {/* Timer modal logic */},
      badge: 'New'
    }
  ];

  const upcomingReminders = [
    { time: '12:00', task: 'Lunch reminder', icon: Utensils },
    { time: '18:00', task: 'Evening workout', icon: Dumbbell },
    { time: '20:00', task: 'Dinner time', icon: Utensils },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 h-full">
      {/* Quick Actions Grid */}
      <Card className="p-3 sm:p-6 bg-white/95 backdrop-blur-sm border-0 shadow-lg flex-1">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Quick Actions</h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            Shortcuts
          </Badge>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'} gap-2 sm:gap-3`}>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            
            return (
              <Button
                key={index}
                variant="ghost"
                onClick={action.action}
                className={`h-auto p-2 sm:p-4 ${action.bgColor} hover:shadow-md transition-all duration-300 transform hover:scale-105 border-0 relative overflow-hidden group`}
              >
                <div className="flex flex-col items-center gap-2 sm:gap-3 w-full">
                  {/* Icon with gradient background */}
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  
                  {/* Action info */}
                  <div className="text-center">
                    <p className={`font-semibold text-xs sm:text-sm ${action.textColor} truncate`}>
                      {action.title}
                    </p>
                    {!isMobile && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {action.description}
                      </p>
                    )}
                  </div>

                  {/* Badge */}
                  <Badge 
                    className={`absolute top-1 right-1 text-xs px-1.5 sm:px-2 py-0.5 bg-white/90 ${action.textColor} border-0 shadow-sm`}
                  >
                    {action.badge}
                  </Badge>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Today's Reminders */}
      <Card className="p-3 sm:p-6 bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Today's Schedule</h3>
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </div>

        <div className="space-y-2 sm:space-y-3">
          {upcomingReminders.map((reminder, index) => {
            const IconComponent = reminder.icon;
            
            return (
              <div 
                key={index}
                className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{reminder.task}</p>
                  <p className="text-xs text-gray-600">{reminder.time}</p>
                </div>

                <Badge variant="outline" className="text-xs bg-white border-gray-200 flex-shrink-0">
                  {reminder.time}
                </Badge>
              </div>
            );
          })}
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-3 sm:mt-4 text-xs sm:text-sm bg-gray-50 hover:bg-gray-100 border-gray-200"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Add Reminder
        </Button>
      </Card>
    </div>
  );
};

export default EnhancedQuickActions;
