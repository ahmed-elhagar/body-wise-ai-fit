
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LoadingState = () => {
  const { isRTL } = useLanguage();

  return (
    <Card className="bg-gray-800 border-gray-600">
      <CardContent className="p-6 text-center">
        <Loader2 className="w-8 h-8 text-[#FF6F3C] mx-auto mb-3 animate-spin" />
        <p className="text-gray-400">
          {isRTL ? 'جاري تحضير قائمة التسوق...' : 'Preparing shopping list...'}
        </p>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
