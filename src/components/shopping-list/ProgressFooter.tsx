
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";

interface ProgressFooterProps {
  checkedCount: number;
  totalItems: number;
}

const ProgressFooter = ({ checkedCount, totalItems }: ProgressFooterProps) => {
  const { isRTL } = useI18n();

  return (
    <Card className="bg-white border-fitness-primary-200 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-fitness-primary-600 font-medium">
            {isRTL ? 'التقدم' : 'Progress'}
          </span>
          <span className="text-fitness-accent-600 font-bold">
            {checkedCount} / {totalItems} {isRTL ? 'مكتمل' : 'completed'}
          </span>
        </div>
        <div className="w-full bg-fitness-primary-100 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-fitness-accent-500 to-fitness-accent-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
          />
        </div>
        <div className="text-center text-sm text-fitness-primary-500 mt-2 font-medium">
          {totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0}%
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressFooter;
