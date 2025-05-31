
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bell, X, Check, Clock, Target, Apple, Dumbbell, Scale } from "lucide-react";
import { useMealPlanData } from "@/hooks/useMealPlanData";
import { useExerciseProgramData } from "@/hooks/useExerciseProgramData";
import { useGoals } from "@/hooks/useGoals";
import { useWeightTracking } from "@/hooks/useWeightTracking";

interface Notification {
  id: string;
  type: 'meal' | 'exercise' | 'goal' | 'weight' | 'reminder';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  actionable: boolean;
}

const NotificationCenter = () => {
  const { t } = useLanguage();
  const { data: currentMealPlan } = useMealPlanData(0);
  const { currentProgram: currentExerciseProgram } = useExerciseProgramData(0, "home");
  const { goals } = useGoals();
  const { weightEntries } = useWeightTracking();

  // Generate real notifications based on user data
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];
      const now = new Date();
      const today = now.getDay() || 7;

      // Meal reminders based on actual meal plan
      if (currentMealPlan?.dailyMeals) {
        const todaysMeals = currentMealPlan.dailyMeals.filter(meal => meal.day_number === today);
        
        if (todaysMeals.length > 0) {
          // Find next meal
          const currentHour = now.getHours();
          let nextMeal = null;
          
          if (currentHour < 9) {
            nextMeal = todaysMeals.find(meal => meal.meal_type === 'breakfast');
          } else if (currentHour < 13) {
            nextMeal = todaysMeals.find(meal => meal.meal_type === 'lunch');
          } else if (currentHour < 19) {
            nextMeal = todaysMeals.find(meal => meal.meal_type === 'dinner');
          }

          if (nextMeal) {
            newNotifications.push({
              id: `meal-${nextMeal.id}`,
              type: 'meal',
              title: t(`${nextMeal.meal_type.charAt(0).toUpperCase() + nextMeal.meal_type.slice(1)} Reminder`),
              message: t(`Time for your ${nextMeal.name} - ${nextMeal.calories} calories`),
              time: '30 min',
              priority: 'medium',
              read: false,
              actionable: true
            });
          }
        }
      }

      // Exercise reminders based on actual program
      if (currentExerciseProgram?.daily_workouts) {
        const todaysWorkouts = currentExerciseProgram.daily_workouts.filter(workout => workout.day_number === today);
        
        if (todaysWorkouts.length > 0) {
          const workout = todaysWorkouts[0];
          const pendingExercises = workout.exercises?.filter(ex => !ex.completed) || [];
          
          if (pendingExercises.length > 0) {
            newNotifications.push({
              id: `workout-${workout.id}`,
              type: 'exercise',
              title: t('Workout Time'),
              message: t(`${workout.workout_name} - ${pendingExercises.length} exercises remaining`),
              time: '1 hour',
              priority: 'high',
              read: false,
              actionable: true
            });
          }
        }
      }

      // Goal progress notifications
      const activeGoals = goals.filter(goal => goal.status === 'active');
      activeGoals.forEach(goal => {
        if (goal.target_value && goal.current_value) {
          const progress = (goal.current_value / goal.target_value) * 100;
          
          if (progress >= 75 && progress < 90) {
            newNotifications.push({
              id: `goal-${goal.id}`,
              type: 'goal',
              title: t('Goal Progress'),
              message: t(`You're ${Math.round(progress)}% towards your ${goal.title} goal!`),
              time: '2 hours ago',
              priority: 'low',
              read: false,
              actionable: false
            });
          } else if (progress >= 90) {
            newNotifications.push({
              id: `goal-complete-${goal.id}`,
              type: 'goal',
              title: t('Goal Almost Complete!'),
              message: t(`You're ${Math.round(progress)}% towards completing ${goal.title}!`),
              time: '1 hour ago',
              priority: 'medium',
              read: false,
              actionable: true
            });
          }
        }
      });

      // Weight tracking reminders
      if (weightEntries.length > 0) {
        const lastEntry = weightEntries[0];
        const daysSinceLastEntry = Math.floor((now.getTime() - new Date(lastEntry.recorded_at).getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastEntry >= 7) {
          newNotifications.push({
            id: 'weight-reminder',
            type: 'weight',
            title: t('Weight Check Reminder'),
            message: t(`It's been ${daysSinceLastEntry} days since your last weigh-in`),
            time: '3 hours ago',
            priority: 'medium',
            read: false,
            actionable: true
          });
        }
      } else {
        newNotifications.push({
          id: 'weight-first',
          type: 'weight',
          title: t('Track Your Progress'),
          message: t('Record your first weight entry to start tracking your journey'),
          time: '1 day ago',
          priority: 'medium',
          read: false,
          actionable: true
        });
      }

      // Add some encouraging notifications if user is doing well
      if (currentMealPlan && currentExerciseProgram && goals.length > 0) {
        newNotifications.push({
          id: 'encouragement',
          type: 'reminder',
          title: t('Great Progress!'),
          message: t('You have an active meal plan, exercise program, and goals set. Keep it up!'),
          time: '6 hours ago',
          priority: 'low',
          read: true,
          actionable: false
        });
      }

      setNotifications(newNotifications.slice(0, 10)); // Limit to 10 notifications
    };

    generateNotifications();
    
    // Update notifications every 30 minutes
    const interval = setInterval(generateNotifications, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentMealPlan, currentExerciseProgram, goals, weightEntries, t]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Apple className="w-4 h-4 text-green-600" />;
      case 'exercise': return <Dumbbell className="w-4 h-4 text-blue-600" />;
      case 'goal': return <Target className="w-4 h-4 text-purple-600" />;
      case 'weight': return <Scale className="w-4 h-4 text-orange-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-blue-600" />
            {t('Notifications')}
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-800"
            >
              <Check className="w-4 h-4 mr-1" />
              {t('Mark all read')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t('No notifications')}</p>
            <p className="text-xs mt-1">{t('Start using the app to receive personalized reminders')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-blue-50 border-blue-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          notification.read ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </div>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
