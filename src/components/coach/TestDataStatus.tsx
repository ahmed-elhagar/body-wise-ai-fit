
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const TestDataStatus = () => {
  const { language } = useLanguage();

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
};
