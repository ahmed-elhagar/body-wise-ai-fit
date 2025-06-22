import React from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { 
  Activity,
  Sparkles,
  Target,
  Globe,
  Heart,
  Zap,
  Trophy,
  Calendar,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PersonalizedWelcomeProps {
  className?: string;
}

export const PersonalizedWelcome: React.FC<PersonalizedWelcomeProps> = ({ className = '' }) => {
  const { profile } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = profile?.first_name || user?.email?.split('@')[0] || 'buddy';
  
  // Cultural greetings based on nationality
  const getCulturalGreeting = (nationality: string) => {
    const greetings: Record<string, { greeting: string; emoji: string; timeContext: string }> = {
      'arabic': { greeting: 'أهلاً وسهلاً', emoji: '🌙', timeContext: 'صباح الخير' },
      'egyptian': { greeting: 'أهلاً وسهلاً', emoji: '🇪🇬', timeContext: 'إزيك' },
      'saudi': { greeting: 'أهلاً وسهلاً', emoji: '🇸🇦', timeContext: 'كيف الحال' },
      'chinese': { greeting: '你好', emoji: '🇨🇳', timeContext: '早上好' },
      'japanese': { greeting: 'こんにちは', emoji: '🇯🇵', timeContext: 'おはよう' },
      'french': { greeting: 'Bonjour', emoji: '🇫🇷', timeContext: 'Bonne journée' },
      'spanish': { greeting: 'Hola', emoji: '🇪🇸', timeContext: 'Buenos días' },
      'german': { greeting: 'Hallo', emoji: '🇩🇪', timeContext: 'Guten Tag' },
      'italian': { greeting: 'Ciao', emoji: '🇮🇹', timeContext: 'Buongiorno' },
      'indian': { greeting: 'नमस्ते', emoji: '🇮🇳', timeContext: 'शुभ प्रभात' },
      'brazilian': { greeting: 'Olá', emoji: '🇧🇷', timeContext: 'Bom dia' },
      'mexican': { greeting: 'Hola', emoji: '🇲🇽', timeContext: 'Buenos días' }
    };
    
    return greetings[nationality?.toLowerCase()] || { greeting: 'Hello', emoji: '👋', timeContext: 'Good morning' };
  };

  // Fitness goal motivational messages
  const getGoalMessage = (goal: string) => {
    const messages: Record<string, { message: string; icon: any; color: string }> = {
      'weight_loss': { 
        message: "Let's burn those calories and reach your target weight!", 
        icon: Target, 
        color: 'text-semantic-error-600' 
      },
      'muscle_gain': { 
        message: "Time to build strength and sculpt your physique!", 
        icon: Trophy, 
        color: 'text-brand-primary-600' 
      },
      'maintenance': { 
        message: "Keep up the great work maintaining your healthy lifestyle!", 
        icon: Heart, 
        color: 'text-brand-secondary-600' 
      },
      'endurance': { 
        message: "Let's boost your stamina and cardiovascular health!", 
        icon: Activity, 
        color: 'text-brand-accent-600' 
      }
    };
    
    return messages[goal] || { 
      message: "Ready to crush your fitness goals today?", 
      icon: Zap, 
      color: 'text-brand-primary-600' 
    };
  };

  // Equipment-based workout suggestions
  const getWorkoutSuggestion = (equipment: string[]) => {
    if (!equipment || equipment.length === 0) {
      return { suggestion: "bodyweight exercises", icon: "🤸", color: "bg-brand-primary-100 text-brand-primary-700" };
    }
    
    if (equipment.includes('full_gym')) {
      return { suggestion: "full gym workout", icon: "🏋️", color: "bg-brand-accent-100 text-brand-accent-700" };
    }
    
    if (equipment.includes('dumbbells')) {
      return { suggestion: "dumbbell training", icon: "💪", color: "bg-brand-secondary-100 text-brand-secondary-700" };
    }
    
    if (equipment.includes('resistance_bands')) {
      return { suggestion: "resistance band workout", icon: "🎯", color: "bg-semantic-warning-100 text-semantic-warning-700" };
    }
    
    return { suggestion: "equipment-based training", icon: "⚡", color: "bg-brand-primary-100 text-brand-primary-700" };
  };

  // Cooking skill-based meal suggestions
  const getMealSuggestion = (cookingSkill: string, maxPrepTime: number) => {
    if (cookingSkill === 'beginner' || maxPrepTime <= 15) {
      return { suggestion: "quick & easy meals", icon: "🥗", color: "bg-brand-secondary-100 text-brand-secondary-700" };
    }
    
    if (cookingSkill === 'advanced' && maxPrepTime >= 60) {
      return { suggestion: "gourmet cooking", icon: "👨‍🍳", color: "bg-brand-accent-100 text-brand-accent-700" };
    }
    
    return { suggestion: "balanced meal prep", icon: "🍽️", color: "bg-brand-primary-100 text-brand-primary-700" };
  };

  const cultural = getCulturalGreeting(profile?.nationality || '');
  const goalInfo = getGoalMessage(profile?.fitness_goal || '');
  const workoutSuggestion = getWorkoutSuggestion((profile as any)?.workout_equipment || []);
  const mealSuggestion = getMealSuggestion((profile as any)?.cooking_skill || '', (profile as any)?.max_prep_time || 30);
  const GoalIcon = goalInfo.icon;

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Card className={`bg-gradient-to-br from-brand-primary-600 via-brand-secondary-600 to-brand-primary-700 text-white border-0 shadow-xl overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-6 left-6 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-6 right-6 w-32 h-32 bg-brand-accent-500/20 rounded-full blur-2xl animate-pulse"></div>
      </div>
      
      <CardContent className="p-4 lg:p-6 relative z-10">
        {/* Compact Cultural Greeting Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-xl">{cultural.emoji}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-medium text-white/90">{getTimeBasedGreeting()},</span>
              <span className="text-lg font-bold text-brand-accent-200">{userName}!</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold">{cultural.greeting}</span>
              {profile?.nationality && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  <Globe className="w-3 h-3 mr-1" />
                  {profile.nationality.charAt(0).toUpperCase() + profile.nationality.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Compact Goal Motivation Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <GoalIcon className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-white">Today's Focus</h3>
          </div>
          <p className="text-white/90 text-sm leading-relaxed">{goalInfo.message}</p>
        </div>

        {/* Compact Personalized Suggestions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Workout Suggestion */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{workoutSuggestion.icon}</span>
              <span className="text-xs font-medium text-white/90">Workout</span>
            </div>
            <p className="text-white text-xs capitalize">{workoutSuggestion.suggestion}</p>
          </div>

          {/* Meal Suggestion */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{mealSuggestion.icon}</span>
              <span className="text-xs font-medium text-white/90">Meals</span>
            </div>
            <p className="text-white text-xs capitalize">{mealSuggestion.suggestion}</p>
          </div>
        </div>

        {/* Compact Quick Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/meal-plan')}
            size="sm"
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/40 text-xs"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Meal Plan
          </Button>
          <Button 
            onClick={() => navigate('/exercise')}
            size="sm"
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/40 text-xs"
          >
            <Activity className="w-3 h-3 mr-1" />
            Workout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 