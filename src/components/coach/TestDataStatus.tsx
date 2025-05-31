
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Play, AlertCircle, Info, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { createSampleProfiles } from "@/utils/sampleDataHelper";
import { useState } from "react";
import { toast } from "sonner";

export const TestDataStatus = () => {
  const { language } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleCreateSampleData = async () => {
    setIsCreating(true);
    try {
      const result = await createSampleProfiles();
      setLastResult(result);
      setIsCreated(true);
      toast.success(language === 'ar' ? 
        'تم إنشاء البيانات التجريبية بنجاح!' :
        'Sample data created successfully!'
      );
    } catch (error) {
      console.error('Error creating sample data:', error);
      toast.error(language === 'ar' ? 
        'فشل في إنشاء البيانات التجريبية' :
        'Failed to create sample data'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleRefreshData = async () => {
    setIsCreated(false);
    setLastResult(null);
    await handleCreateSampleData();
  };

  if (isCreated && lastResult) {
    return (
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'البيانات التجريبية جاهزة' : 'Sample Data Ready'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 mb-4">
            <Users className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-green-700 font-medium">
                {language === 'ar' ? 
                  'تم إنشاء البيانات التجريبية بنجاح!' :
                  'Sample coach-trainee relationships created successfully!'
                }
              </p>
              <div className="text-sm text-green-600 mt-2 space-y-1">
                <p>• {lastResult.data?.coaches || 0} coaches updated</p>
                <p>• {lastResult.data?.trainees || 0} trainees updated</p>
                <p>• {lastResult.data?.newRelationships || 0} new relationships created</p>
                <p>• {lastResult.data?.newMealPlans || 0} new meal plans</p>
                <p>• {lastResult.data?.newExercisePrograms || 0} new exercise programs</p>
                <p>• {lastResult.data?.newGoals || 0} new goals</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleRefreshData}
            variant="outline"
            size="sm"
            className="text-green-700 border-green-300 hover:bg-green-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          {language === 'ar' ? 'إعداد البيانات التجريبية' : 'Setup Sample Data'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-blue-700 font-medium mb-3">
              {language === 'ar' ? 
                'إنشاء بيانات تجريبية لاختبار نظام التدريب' :
                'Create sample data to test the coach system'
              }
            </p>
            
            <div className="mb-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    {language === 'ar' ? 'متطلبات مسبقة:' : 'Prerequisites:'}
                  </p>
                  <p className="text-sm text-blue-700">
                    {language === 'ar' ? 
                      'يجب أن يكون لديك على الأقل 3 حسابات مستخدمين مسجلة في النظام' :
                      'You need at least 3 user accounts registered in the system'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-blue-600 mb-4">
              {language === 'ar' ? 
                'سيتم استخدام المستخدمين الحاليين لإنشاء مدربين ومتدربين مع جميع البيانات المطلوبة. إذا كانت البيانات موجودة بالفعل، فسيتم تحديثها فقط.' :
                'Will use existing users to create coaches and trainees with all necessary sample data. If data already exists, it will only be updated.'
              }
            </p>
            <Button 
              onClick={handleCreateSampleData}
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'ar' ? 'جارٍ الإنشاء...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'إنشاء البيانات التجريبية' : 'Create Sample Data'}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
