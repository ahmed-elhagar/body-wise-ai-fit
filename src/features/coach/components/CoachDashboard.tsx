
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Activity, Target, TrendingUp } from "lucide-react";
import { useCoachSystem } from "@/features/coach/hooks/useCoachSystem";
import { useLanguage } from "@/contexts/LanguageContext";
import AssignTraineeDialog from "./AssignTraineeDialog";
import TraineeCard from "./TraineeCard";
import { useState } from "react";

const CoachDashboard = () => {
  const { trainees, isLoadingTrainees, isCoach } = useCoachSystem();
  const { language, t } = useLanguage();
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  if (!isCoach) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'الوصول محظور' : 'Access Denied'}
              </h2>
              <p className="text-gray-600">
                {language === 'ar' ? 
                  'هذه الصفحة متاحة فقط للمدربين المعتمدين.' :
                  'This page is only available to certified coaches.'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const completedProfiles = trainees.filter(t => 
    (t.trainee_profile.profile_completion_score || 0) >= 80
  ).length;

  const activeTrainees = trainees.filter(t => 
    (t.trainee_profile.ai_generations_remaining || 0) > 0
  ).length;

  if (isLoadingTrainees) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'لوحة المدرب' : 'Coach Dashboard'}
            </h1>
            <p className="text-gray-600">
              {language === 'ar' ? 
                'إدارة ومتابعة تقدم المتدربين' :
                'Manage and track your trainees\' progress'
              }
            </p>
          </div>
          <Button 
            onClick={() => setShowAssignDialog(true)}
            className="mt-4 md:mt-0"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'إضافة متدرب' : 'Add Trainee'}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'إجمالي المتدربين' : 'Total Trainees'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{trainees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'متدربين نشطين' : 'Active Trainees'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{activeTrainees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'ملفات مكتملة' : 'Completed Profiles'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{completedProfiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'معدل الإكمال' : 'Completion Rate'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {trainees.length > 0 ? Math.round((completedProfiles / trainees.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trainees Grid */}
        {trainees.length === 0 ? (
          <Card className="text-center">
            <CardContent className="p-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'لا يوجد متدربين بعد' : 'No Trainees Yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'ar' ? 
                  'ابدأ بإضافة متدرب جديد لبدء رحلة التدريب معًا.' :
                  'Start by adding a new trainee to begin your coaching journey together.'
                }
              </p>
              <Button onClick={() => setShowAssignDialog(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إضافة أول متدرب' : 'Add First Trainee'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainees.map((trainee) => (
              <TraineeCard key={trainee.id} trainee={trainee} />
            ))}
          </div>
        )}

        {/* Assign Trainee Dialog */}
        <AssignTraineeDialog 
          open={showAssignDialog}
          onOpenChange={setShowAssignDialog}
        />
      </div>
    </div>
  );
};

export default CoachDashboard;
