
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProgressFooterProps {
  checkedCount: number;
  totalItems: number;
}

const ProgressFooter = ({ checkedCount, totalItems }: ProgressFooterProps) => {
  const { isRTL } = useLanguage();

  return (
    <Card className="bg-gray-800 border-gray-600">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">
            {isRTL ? 'التقدم' : 'Progress'}
          </span>
          <span className="text-[#FF6F3C] font-medium">
            {checkedCount} / {totalItems} {isRTL ? 'مكتمل' : 'completed'}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[#FF6F3C] to-[#FF8F4C] h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
          />
        </div>
        <div className="text-center text-sm text-gray-400 mt-1">
          {totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0}%
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressFooter;
