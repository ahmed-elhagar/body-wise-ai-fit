
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";
import { useI18n } from "@/hooks/useI18n";

const LoadingState = () => {
  const { isRTL } = useI18n();

  return (
    <div className="bg-white rounded-lg border-fitness-primary-200 shadow-lg p-6">
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
        className="bg-white border-fitness-primary-200 text-fitness-primary-600"
      />
    </div>
  );
};

export default LoadingState;
