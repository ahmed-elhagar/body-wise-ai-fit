
import { Card, CardContent } from "@/components/ui/card";
import { FoodConsumptionLog } from "../hooks";
import { format } from "date-fns";

interface VirtualizedMealHistoryProps {
  groupedHistory: { date: string; entries: FoodConsumptionLog[] }[];
}

const VirtualizedMealHistory = ({ groupedHistory }: VirtualizedMealHistoryProps) => {
  if (groupedHistory.length === 0) {
    return <p className="text-center text-gray-500 py-8">No meals logged in this period.</p>;
  }

  return (
    <div className="space-y-4">
      {groupedHistory.map(({ date, entries }) => (
        <div key={date}>
          <h3 className="font-semibold mb-2">{format(new Date(date), 'EEEE, MMMM d')}</h3>
          <div className="space-y-2">
            {entries.map(entry => (
              <Card key={entry.id}>
                <CardContent className="p-3">
                  <p className="font-medium">{entry.food_item?.name || 'Unknown Food'}</p>
                  <p className="text-sm text-gray-600">{Math.round(entry.calories_consumed || 0)} calories</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VirtualizedMealHistory;
