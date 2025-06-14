
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, TrendingUp, Calendar, Edit, Trash2, Trophy, Clock } from "lucide-react";
import { Goal, useGoals } from "@/hooks/useGoals";

interface EnhancedGoalCardProps {
  goal: Goal;
  onEdit?: () => void;
  showActions?: boolean;
}

const EnhancedGoalCard = ({ goal, onEdit, showActions = true }: EnhancedGoalCardProps) => {
  const { t } = useLanguage();
  const { deleteGoal, calculateProgress } = useGoals();

  const progress = calculateProgress(goal);
  const isCompleted = progress >= 100;
  const daysRemaining = goal.target_date 
    ? Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case 'weight': return '⚖️';
      case 'calories': return '🔥';
      case 'protein': return '💪';
      case 'carbs': return '🍞';
      case 'fat': return '🥑';
      default: return '🎯';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDelete = () => {
    if (window.confirm(t('Are you sure you want to delete this goal?'))) {
      deleteGoal(goal.id);
    }
  };

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${isCompleted ? 'ring-2 ring-green-200' : ''}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getGoalTypeIcon(goal.goal_type)}</div>
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  {goal.title}
                  {isCompleted && <Trophy className="w-4 h-4 text-yellow-500" />}
                </h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
            </div>
            {showActions && (
              <div className="flex items-center gap-2">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEdit}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('Progress')}</span>
              <span className="font-medium text-gray-800">
                {progress.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={progress} 
              className={`h-3 ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {goal.current_value} {goal.target_unit}
              </span>
              <span>
                {goal.target_value} {goal.target_unit}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getStatusColor(goal.status)}>
              {goal.status}
            </Badge>
            <Badge className={getDifficultyColor(goal.difficulty)}>
              {goal.difficulty}
            </Badge>
            <Badge className={`${goal.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
              {goal.priority} priority
            </Badge>
          </div>

          {/* Timeline */}
          {daysRemaining !== null && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <Clock className="w-4 h-4" />
              {daysRemaining > 0 ? (
                <span>
                  {daysRemaining} {t('days remaining')}
                </span>
              ) : daysRemaining === 0 ? (
                <span className="text-orange-600 font-medium">
                  {t('Due today!')}
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  {Math.abs(daysRemaining)} {t('days overdue')}
                </span>
              )}
            </div>
          )}

          {/* Notes */}
          {goal.notes && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-blue-800">{goal.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedGoalCard;
