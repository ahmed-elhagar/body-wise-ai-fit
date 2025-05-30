
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

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
      percentage: calories > 0 ? Math.round((proteinCals / calories) * 100) : 0,
      color: '#ef4444', // red
    },
    {
      name: 'Carbs',
      value: carbsCals,
      percentage: calories > 0 ? Math.round((carbsCals / calories) * 100) : 0,
      color: '#3b82f6', // blue
    },
    {
      name: 'Fat',
      value: fatCals,
      percentage: calories > 0 ? Math.round((fatCals / calories) * 100) : 0,
      color: '#f59e0b', // amber
    },
  ];

  if (calories === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-sm">No food logged yet today</p>
      </div>
    );
  }

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => 
              `${value}: ${entry.payload.percentage}%`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroWheel;
