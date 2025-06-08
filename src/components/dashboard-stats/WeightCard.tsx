
import { Card } from "@/components/ui/card";
import { Scale, TrendingUp, TrendingDown } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface WeightCardProps {
  currentWeight?: number;
  previousWeight?: number;
  targetWeight?: number;
  unit?: 'kg' | 'lbs';
}

const WeightCard = ({ 
  currentWeight = 70, 
  previousWeight = 72, 
  targetWeight = 65,
  unit = 'kg' 
}: WeightCardProps) => {
  const { t, isRTL } = useI18n();
  
  const weightChange = currentWeight - previousWeight;
  const isDecreasing = weightChange < 0;
  const progressToTarget = targetWeight ? ((previousWeight - currentWeight) / (previousWeight - targetWeight)) * 100 : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200">
      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <p className="text-indigo-600 text-sm font-medium">
            {t('dashboard:currentWeight') || 'Current Weight'}
          </p>
          <p className="text-2xl font-bold text-indigo-900">
            {currentWeight} {unit}
          </p>
        </div>
        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
          <Scale className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isDecreasing ? (
            <TrendingDown className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingUp className="w-4 h-4 text-red-600" />
          )}
          <span className={`text-sm font-medium ${isDecreasing ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(weightChange).toFixed(1)} {unit} {isDecreasing ? 
              (t('dashboard:lost') || 'lost') : 
              (t('dashboard:gained') || 'gained')
            }
          </span>
        </div>
        
        <div className={`text-xs text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('dashboard:target') || 'Target'}: {targetWeight} {unit}
        </div>
        
        {progressToTarget > 0 && (
          <div className={`text-xs text-indigo-600 ${isRTL ? 'text-right' : 'text-left'}`}>
            {Math.round(progressToTarget)}% {t('dashboard:progressToTarget') || 'progress to target'}
          </div>
        )}
      </div>
    </Card>
  );
};

export default WeightCard;
