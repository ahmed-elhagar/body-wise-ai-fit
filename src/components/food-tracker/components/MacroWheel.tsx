
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Utensils, Target } from "lucide-react";

interface MacroWheelProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const MacroWheel = ({ calories, protein, carbs, fat }: MacroWheelProps) => {
  // Calculate calories from macros (protein=4cal/g, carbs=4cal/g, fat=9cal/g)
  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatCals = fat * 9;

  const data = [
    {
      name: 'Protein',
      value: proteinCals,
      grams: protein,
      percentage: calories > 0 ? Math.round((proteinCals / calories) * 100) : 0,
      color: '#ef4444', // red
    },
    {
      name: 'Carbs',
      value: carbsCals,
      grams: carbs,
      percentage: calories > 0 ? Math.round((carbsCals / calories) * 100) : 0,
      color: '#3b82f6', // blue
    },
    {
      name: 'Fat',
      value: fatCals,
      grams: fat,
      percentage: calories > 0 ? Math.round((fatCals / calories) * 100) : 0,
      color: '#f59e0b', // amber
    },
  ];

  if (calories === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
              <Utensils className="w-8 h-8 text-gray-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Target className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Start Your Food Journey</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Log your first meal to see your nutrition breakdown and macro distribution
            </p>
          </div>
          <div className="flex items-center justify-center space-x-4 pt-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-xs text-gray-500">Protein</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-gray-500">Carbs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-xs text-gray-500">Fat</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Pie Chart */}
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="white"
                  strokeWidth={3}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center calories display */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{Math.round(calories)}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">calories</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700">{entry.name}:</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {Math.round(entry.grams)}g ({entry.percentage}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MacroWheel;
