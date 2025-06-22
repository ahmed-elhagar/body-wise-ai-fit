import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { 
  Camera,
  Dumbbell,
  Target,
  TrendingUp,
  Plus,
  Calendar,
  Utensils,
  Activity,
  Clock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuickActionsProps {
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  // Get personalized quick actions based on user preferences
  const getPersonalizedActions = () => {
    const fitnessGoal = profile?.fitness_goal || 'maintenance';
    const cookingSkill = (profile as any)?.cooking_skill || 'beginner';
    const equipment = (profile as any)?.workout_equipment || [];
    
    const actions = [
      {
        id: 'log-meal',
        title: 'Log Meal',
        description: 'Quick food tracking',
        icon: Camera,
        color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
        iconColor: 'text-emerald-600',
        action: () => navigate('/food-tracker'),
        priority: 1
      },
      {
        id: 'quick-workout',
        title: 'Quick Workout',
        description: equipment.includes('bodyweight') ? 'Bodyweight session' : 'Start training',
        icon: Dumbbell,
        color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
        iconColor: 'text-blue-600',
        action: () => navigate('/exercise'),
        priority: 1
      },
      {
        id: 'track-progress',
        title: 'Track Progress',
        description: 'Update measurements',
        icon: TrendingUp,
        color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
        iconColor: 'text-purple-600',
        action: () => navigate('/progress'),
        priority: 2
      },
      {
        id: 'meal-plan',
        title: cookingSkill === 'beginner' ? 'Simple Recipes' : 'Meal Planning',
        description: cookingSkill === 'beginner' ? 'Easy healthy meals' : 'Plan your nutrition',
        icon: Utensils,
        color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
        iconColor: 'text-orange-600',
        action: () => navigate('/meal-plan'),
        priority: 2
      }
    ];

    // Add goal-specific actions
    if (fitnessGoal === 'weight_loss') {
      actions.push({
        id: 'calorie-deficit',
        title: 'Calorie Tracker',
        description: 'Monitor deficit',
        icon: Target,
        color: 'bg-red-50 hover:bg-red-100 border-red-200',
        iconColor: 'text-red-600',
        action: () => navigate('/food-tracker'),
        priority: 1
      });
    }

    if (fitnessGoal === 'muscle_gain') {
      actions.push({
        id: 'protein-tracker',
        title: 'Protein Focus',
        description: 'Track protein intake',
        icon: Zap,
        color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
        iconColor: 'text-indigo-600',
        action: () => navigate('/food-tracker'),
        priority: 1
      });
    }

    // Sort by priority and return top 6
    return actions.sort((a, b) => a.priority - b.priority).slice(0, 6);
  };

  const personalizedActions = getPersonalizedActions();

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-gray-800">
          <div className="w-10 h-10 bg-brand-accent-100 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-brand-accent-600" />
          </div>
          Quick Actions
          <Badge variant="outline" className="ml-auto text-xs">
            Personalized
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {personalizedActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 ${action.color}`}
                onClick={action.action}
              >
                <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${action.iconColor}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Today's Focus Section */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Today's Focus
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto p-3 flex items-center gap-3 bg-gradient-to-r from-brand-primary-50 to-brand-secondary-50 hover:from-brand-primary-100 hover:to-brand-secondary-100 border-brand-primary-200"
              onClick={() => navigate('/exercise')}
            >
              <div className="w-8 h-8 bg-brand-primary-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-brand-primary-600" />
              </div>
              <div className="text-left flex-1">
                <div className="font-medium text-sm text-gray-900">
                  Today's Workout
                </div>
                <div className="text-xs text-gray-600">
                  {(profile as any)?.workout_equipment?.includes('full_gym') ? 'Gym session' : 'Home workout'}
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-3 flex items-center gap-3 bg-gradient-to-r from-brand-secondary-50 to-brand-accent-50 hover:from-brand-secondary-100 hover:to-brand-accent-100 border-brand-secondary-200"
              onClick={() => navigate('/meal-plan')}
            >
              <div className="w-8 h-8 bg-brand-secondary-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-brand-secondary-600" />
              </div>
              <div className="text-left flex-1">
                <div className="font-medium text-sm text-gray-900">
                  Meal Planning
                </div>
                <div className="text-xs text-gray-600">
                  {(profile as any)?.cooking_skill === 'beginner' ? 'Simple recipes' : 'Advanced planning'}
                </div>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 