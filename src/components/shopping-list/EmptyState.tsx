
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const EmptyState = () => {
  const { isRTL } = useLanguage();

  return (
    <Card className="bg-gray-800 border-gray-600">
      <CardContent className="p-6 text-center">
        <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400 mb-2">
          {isRTL ? 'قائمة التسوق فارغة' : 'No shopping list available'}
        </p>
        <p className="text-sm text-gray-500">
          {isRTL ? 'أنشئ خطة وجبات لإنشاء قائمة التسوق' : 'Generate a meal plan to create your shopping list'}
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
