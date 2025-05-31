
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";
import { useLanguage } from "@/contexts/LanguageContext";

const LoadingState = () => {
  const { isRTL } = useLanguage();

  return (
    <EnhancedLoadingIndicator
      status="loading"
      type="general"
      message={isRTL ? 'جاري تحضير قائمة التسوق...' : 'Preparing shopping list...'}
      description="Organizing ingredients from your meal plan"
      variant="card"
      size="lg"
      showSteps={true}
      customSteps={[
        isRTL ? 'تحليل خطة الوجبات...' : 'Analyzing meal plan...',
        isRTL ? 'جمع المكونات...' : 'Collecting ingredients...',
        isRTL ? 'تنظيم القائمة...' : 'Organizing list...',
        isRTL ? 'إضافة التفاصيل...' : 'Adding details...'
      ]}
      className="bg-gray-800 border-gray-600 text-gray-400"
    />
  );
};

export default LoadingState;
