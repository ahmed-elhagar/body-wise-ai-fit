
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/useI18n";

interface LoadingProgressBarProps {
  progress: number;
}

export const LoadingProgressBar = ({ progress }: LoadingProgressBarProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className="mb-8">
      <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="text-sm font-medium text-gray-700">
          {t('mealPlan:progress')}
        </span>
        <span className="text-sm font-bold text-green-600">
          {Math.round(progress)}%
        </span>
      </div>
      <Progress value={progress} className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </Progress>
    </div>
  );
};
