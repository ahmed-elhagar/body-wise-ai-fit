
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const TestDataStatus = () => {
  const { language } = useLanguage();

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          {language === 'ar' ? 'حالة البيانات التجريبية' : 'Test Data Status'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-orange-700">
          {language === 'ar' ? 
            'تم إعداد نظام التدريب بنجاح. يتم الآن إعداد البيانات التجريبية...' :
            'Coach system setup complete. Setting up sample data...'
          }
        </p>
        <p className="text-sm text-orange-600 mt-2">
          {language === 'ar' ? 
            'سيتم إضافة بيانات تجريبية قريباً لاختبار النظام.' :
            'Sample data will be added shortly for testing the system.'
          }
        </p>
      </CardContent>
    </Card>
  );
};
