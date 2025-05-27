
import { Card } from "@/components/ui/card";

interface DayOverview {
  day: string;
  calories: number;
  status: 'completed' | 'current' | 'planned';
}

interface WeeklyOverviewProps {
  weeklyData: DayOverview[];
}

const WeeklyOverview = ({ weeklyData }: WeeklyOverviewProps) => {
  return (
    <Card className="mt-8 p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Overview</h3>
      <div className="grid grid-cols-7 gap-4">
        {weeklyData.map((day, index) => (
          <div
            key={index}
            className={`text-center p-4 rounded-lg ${
              day.status === 'current' 
                ? 'bg-fitness-gradient text-white' 
                : day.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-50 text-gray-600'
            }`}
          >
            <p className="font-medium">{day.day}</p>
            <p className="text-sm mt-1">{day.calories} cal</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeeklyOverview;
