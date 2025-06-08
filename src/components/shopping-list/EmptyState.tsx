
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const EmptyState = () => {
  const { isRTL } = useLanguage();

  return (
    <Card className="bg-white border-fitness-primary-200 shadow-lg">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-fitness-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-fitness-primary-500" />
        </div>
        <h3 className="text-lg font-semibold text-fitness-primary-700 mb-2">
          {isRTL ? 'قائمة التسوق فارغة' : 'No Shopping List Available'}
        </h3>
        <p className="text-sm text-fitness-primary-600">
          {isRTL ? 'أنشئ خطة وجبات لإنشاء قائمة التسوق' : 'Generate a meal plan to create your shopping list'}
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
