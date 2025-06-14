
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

interface FoodConsumptionLog {
  id: string;
  user_id: string;
  food_item_id: string;
  quantity_g: number;
  meal_type: string;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  consumed_at: string;
  meal_image_url?: string;
  notes?: string;
  source: string;
  ai_analysis_data?: any;
  food_item?: {
    id: string;
    name: string;
    brand?: string;
    category: string;
    serving_description?: string;
  };
}

interface VirtualizedMealHistoryProps {
  groupedHistory: Array<{
    date: string;
    entries: FoodConsumptionLog[];
  }>;
}

// Memoized Meal Entry Component
const MealEntry = ({ entry }: { entry: FoodConsumptionLog }) => {
  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🍽️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍴';
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lunch': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'dinner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'snack': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`text-xs ${getMealTypeColor(entry.meal_type)}`}>
              {getMealTypeIcon(entry.meal_type)} {entry.meal_type}
            </Badge>
            <span className="text-xs text-gray-500">
              {format(parseISO(entry.consumed_at), 'h:mm a')}
            </span>
          </div>
          
          <h5 className="font-medium text-gray-900 mb-1 text-sm">
            {entry.food_item?.name || 'Unknown Food'}
          </h5>
          
          {entry.food_item?.brand && (
            <p className="text-xs text-gray-600 mb-2">
              {entry.food_item.brand}
            </p>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Cal:</span>
              <span className="font-medium ml-1">{Math.round(entry.calories_consumed)}</span>
            </div>
            <div>
              <span className="text-gray-500">P:</span>
              <span className="font-medium ml-1">{Math.round(entry.protein_consumed)}g</span>
            </div>
            <div>
              <span className="text-gray-500">C:</span>
              <span className="font-medium ml-1">{Math.round(entry.carbs_consumed)}g</span>
            </div>
            <div>
              <span className="text-gray-500">F:</span>
              <span className="font-medium ml-1">{Math.round(entry.fat_consumed)}g</span>
            </div>
          </div>
          
          {entry.notes && (
            <p className="text-xs text-gray-600 mt-2 italic line-clamp-2">
              "{entry.notes}"
            </p>
          )}
        </div>
        
        <div className="text-right ml-3">
          <div className="text-xs text-gray-500">Qty</div>
          <div className="font-medium text-sm">{entry.quantity_g}g</div>
          {entry.source && (
            <Badge variant="outline" className="text-xs mt-1">
              {entry.source}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

// Memoized Day Group Component
const DayGroup = ({ date, entries }: { date: string; entries: FoodConsumptionLog[] }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="border-l-4 border-green-200 pl-3">
      <div 
        className="font-semibold text-gray-900 mb-3 flex items-center gap-2 cursor-pointer hover:text-green-600 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Calendar className="w-4 h-4" />
        {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
        <Badge variant="outline" className="text-xs">
          {entries.length} meals
        </Badge>
        <span className="text-xs text-gray-500 ml-auto">
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>
      
      {isExpanded && (
        <div className="grid gap-2">
          {entries.map((entry) => (
            <MealEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
};

const VirtualizedMealHistory = ({ groupedHistory }: VirtualizedMealHistoryProps) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const visibleHistory = useMemo(() => {
    return groupedHistory.slice(0, visibleCount);
  }, [groupedHistory, visibleCount]);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, groupedHistory.length));
  };

  if (groupedHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No meals logged</h3>
        <p className="text-gray-500">Start logging your meals to see your food history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visibleHistory.map(({ date, entries }) => (
        <DayGroup key={date} date={date} entries={entries} />
      ))}
      
      {visibleCount < groupedHistory.length && (
        <div className="text-center py-4">
          <button
            onClick={loadMore}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Load more ({groupedHistory.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default VirtualizedMealHistory;
