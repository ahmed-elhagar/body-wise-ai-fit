
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Play, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { createSampleProfiles } from "@/utils/sampleDataHelper";
import { useState } from "react";
import { toast } from "sonner";

export const TestDataStatus = () => {
  const { language } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const handleCreateSampleData = async () => {
    setIsCreating(true);
    try {
      await createSampleProfiles();
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

  if (isCreated) {
    return (
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'البيانات التجريبية جاهزة' : 'Sample Data Ready'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-green-700 font-medium">
                {language === 'ar' ? 
                  'تم إنشاء البيانات التجريبية بنجاح!' :
                  'Sample coach-trainee relationships created successfully!'
                }
              </p>
              <p className="text-sm text-green-600 mt-1">
                {language === 'ar' ? 
                  '٢ مدربين و ٥ متدربين مع خطط وجبات وتمارين وأهداف' :
                  '2 coaches and 5 trainees with meal plans, exercise programs, and goals'
                }
              </p>
            </div>
          </div>
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
            <p className="text-sm text-blue-600 mb-4">
              {language === 'ar' ? 
                'سيتم إنشاء ٢ مدربين و ٥ متدربين مع جميع البيانات المطلوبة للاختبار' :
                'This will create 2 coaches and 5 trainees with all necessary data for testing'
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
