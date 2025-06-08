
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeightCardProps {
  displayWeight: number | null;
  weightLoading: boolean;
  weightChange: number | null;
  weightSource: string;
}

export const WeightCard = ({ displayWeight, weightLoading, weightChange, weightSource }: WeightCardProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Current Weight</p>
          <p className="text-2xl font-bold text-gray-800">
            {weightLoading ? (
              "Loading..."
            ) : displayWeight ? (
              `${displayWeight} kg`
            ) : (
              '—'
            )}
          </p>
          {weightChange && (
            <p className={`text-sm ${weightChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
            </p>
          )}
          {displayWeight && (
            <p className="text-xs text-gray-500">
              {weightSource === 'profile' ? 'From profile' : 'From weight tracking'}
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-fitness-gradient rounded-full flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};
