
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Target, 
  Activity, 
  TrendingUp, 
  Calendar,
  Weight,
  Ruler,
  Zap
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTraineeData } from "@/hooks/useTraineeData";
import { type CoachTraineeRelationship } from "@/hooks/useCoachSystem";

interface TraineeDetailsDialogProps {
  trainee: CoachTraineeRelationship;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TraineeDetailsDialog = ({ trainee, open, onOpenChange }: TraineeDetailsDialogProps) => {
  const { language } = useLanguage();
  const { 
    mealPlans, 
    exercisePrograms, 
    weightEntries, 
    goals, 
    isLoading 
  } = useTraineeData(trainee.trainee_id);

  const profile = trainee.trainee_profile;
  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();

  const getLatestWeight = () => {
    if (weightEntries.length === 0) return null;
    return weightEntries[0].weight;
  };

  const getWeightTrend = () => {
    if (weightEntries.length < 2) return null;
    const latest = weightEntries[0].weight;
    const previous = weightEntries[1].weight;
    return latest - previous;
  };

  const activeGoals = goals.filter(g => g.status === 'active').length;
  const latestWeight = getLatestWeight();
  const weightTrend = getWeightTrend();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'تفاصيل المتدرب' : 'Trainee Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  <p className="text-gray-600">{profile.email}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <Badge variant="outline">
                      {language === 'ar' ? 'الملف:' : 'Profile:'} {profile.profile_completion_score || 0}%
                    </Badge>
                    <Badge variant="outline">
                      {language === 'ar' ? 'رصيد AI:' : 'AI Credits:'} {profile.ai_generations_remaining || 0}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {profile.age && (
              <Card>
                <CardContent className="p-4 text-center">
                  <User className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'العمر' : 'Age'}
                  </p>
                  <p className="text-lg font-semibold">{profile.age}</p>
                </CardContent>
              </Card>
            )}

            {profile.weight && (
              <Card>
                <CardContent className="p-4 text-center">
                  <Weight className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'الوزن' : 'Weight'}
                  </p>
                  <p className="text-lg font-semibold">{profile.weight} kg</p>
                </CardContent>
              </Card>
            )}

            {profile.height && (
              <Card>
                <CardContent className="p-4 text-center">
                  <Ruler className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'الطول' : 'Height'}
                  </p>
                  <p className="text-lg font-semibold">{profile.height} cm</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'الأهداف النشطة' : 'Active Goals'}
                </p>
                <p className="text-lg font-semibold">{activeGoals}</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Meal Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'خطط الوجبات' : 'Meal Plans'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ) : mealPlans.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{mealPlans.length}</p>
                    <p className="text-xs text-gray-600">
                      {language === 'ar' ? 'آخر خطة:' : 'Latest:'} {new Date(mealPlans[0].created_at).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    {language === 'ar' ? 'لا توجد خطط وجبات' : 'No meal plans yet'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Exercise Programs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'برامج التمرين' : 'Exercise Programs'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ) : exercisePrograms.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{exercisePrograms.length}</p>
                    <p className="text-xs text-gray-600">
                      {language === 'ar' ? 'آخر برنامج:' : 'Latest:'} {new Date(exercisePrograms[0].created_at).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    {language === 'ar' ? 'لا توجد برامج تمرين' : 'No exercise programs yet'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Weight Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'تقدم الوزن' : 'Weight Progress'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ) : latestWeight ? (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{latestWeight} kg</p>
                    {weightTrend && (
                      <p className={`text-xs flex items-center ${
                        weightTrend > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        <TrendingUp className={`h-3 w-3 mr-1 ${weightTrend < 0 ? 'rotate-180' : ''}`} />
                        {Math.abs(weightTrend).toFixed(1)} kg
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    {language === 'ar' ? 'لا توجد بيانات وزن' : 'No weight data yet'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Assignment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'معلومات التعيين' : 'Assignment Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'تاريخ التعيين' : 'Assigned Date'}
                  </p>
                  <p className="font-medium">
                    {new Date(trainee.assigned_at).toLocaleDateString()}
                  </p>
                </div>
                {trainee.notes && (
                  <div>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'ملاحظات' : 'Notes'}
                    </p>
                    <p className="text-sm bg-gray-50 p-2 rounded">{trainee.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
