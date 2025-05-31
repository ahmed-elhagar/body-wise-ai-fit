
import LoadingIndicator from "@/components/ui/loading-indicator";
import { useLanguage } from "@/contexts/LanguageContext";

const LoadingState = () => {
  const { isRTL } = useLanguage();

  return (
    <LoadingIndicator
      status="loading"
      message={isRTL ? 'جاري تحضير قائمة التسوق...' : 'Preparing shopping list...'}
      variant="card"
      size="lg"
      className="bg-gray-800 border-gray-600 text-gray-400"
    />
  );
};

export default LoadingState;
