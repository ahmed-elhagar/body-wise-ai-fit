import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Calendar, 
  Target, 
  Activity, 
  MessageSquare, 
  MoreVertical,
  Trash2,
  Edit3
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useCoachSystem, type CoachTraineeRelationship } from "@/hooks/useCoachSystem";
import { useI18n } from "@/hooks/useI18n";
import { TraineeDetailsDialog } from "./TraineeDetailsDialog";
import { UpdateNotesDialog } from "./UpdateNotesDialog";

interface TraineeCardProps {
  trainee: CoachTraineeRelationship;
}

export const TraineeCard = ({ trainee }: TraineeCardProps) => {
  const { removeTrainee } = useCoachSystem();
  const { language } = useI18n();
  const [showDetails, setShowDetails] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);

  const profile = trainee.trainee_profile;
  const completionScore = profile.profile_completion_score || 0;
  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();

  const getCompletionColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getActivityStatus = () => {
    const aiCredits = profile.ai_generations_remaining || 0;
    if (aiCredits > 3) return { label: language === 'ar' ? 'نشط' : 'Active', color: 'bg-green-500' };
    if (aiCredits > 0) return { label: language === 'ar' ? 'منخفض' : 'Low', color: 'bg-yellow-500' };
    return { label: language === 'ar' ? 'غير نشط' : 'Inactive', color: 'bg-red-500' };
  };

  const activityStatus = getActivityStatus();

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {profile.first_name} {profile.last_name}
                </CardTitle>
                <p className="text-sm text-gray-600">{profile.email}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  <User className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowNotesDialog(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'تحديث الملاحظات' : 'Update Notes'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => removeTrainee(trainee.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'إلغاء التعيين' : 'Remove Trainee'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Profile Completion */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {language === 'ar' ? 'اكتمال الملف' : 'Profile Completion'}
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-200">
                <div 
                  className={`w-full h-full rounded-full ${getCompletionColor(completionScore)}`}
                  style={{ width: `${completionScore}%` }}
                />
              </div>
              <span className="text-sm font-medium">{completionScore}%</span>
            </div>
          </div>

          {/* Activity Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {language === 'ar' ? 'حالة النشاط' : 'Activity Status'}
            </span>
            <Badge variant="secondary" className={`text-white ${activityStatus.color}`}>
              {activityStatus.label}
            </Badge>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {profile.age && (
              <div>
                <p className="text-gray-600">{language === 'ar' ? 'العمر' : 'Age'}</p>
                <p className="font-medium">{profile.age}</p>
              </div>
            )}
            {profile.fitness_goal && (
              <div>
                <p className="text-gray-600">{language === 'ar' ? 'الهدف' : 'Goal'}</p>
                <p className="font-medium text-xs capitalize">{profile.fitness_goal}</p>
              </div>
            )}
          </div>

          {/* AI Credits */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {language === 'ar' ? 'رصيد الذكاء الاصطناعي' : 'AI Credits'}
            </span>
            <span className="text-sm font-medium">
              {profile.ai_generations_remaining || 0}
            </span>
          </div>

          {/* Assignment Date */}
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {language === 'ar' ? 'مُعيَّن في' : 'Assigned'} {new Date(trainee.assigned_at).toLocaleDateString()}
          </div>

          {/* Notes Preview */}
          {trainee.notes && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <MessageSquare className="h-3 w-3 inline mr-1" />
              {trainee.notes.length > 50 ? 
                `${trainee.notes.substring(0, 50)}...` : 
                trainee.notes
              }
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowDetails(true)}
            >
              <Activity className="h-3 w-3 mr-1" />
              {language === 'ar' ? 'التفاصيل' : 'Details'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <TraineeDetailsDialog 
        trainee={trainee}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
      <UpdateNotesDialog 
        trainee={trainee}
        open={showNotesDialog}
        onOpenChange={setShowNotesDialog}
      />
    </>
  );
};
