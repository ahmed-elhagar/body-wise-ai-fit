
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Apple, Plus, Edit, Target } from "lucide-react";
import { useState } from "react";
import { useGoals, CreateGoalData } from "@/hooks/useGoals";

const MacroGoalsCard = () => {
  const { getMacroGoals, createGoal, updateGoal, isCreating, isUpdating } = useGoals();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const macroGoals = getMacroGoals();
  const caloriesGoal = macroGoals.find(g => g.goal_type === 'calories');
  const proteinGoal = macroGoals.find(g => g.goal_type === 'protein');
  const carbsGoal = macroGoals.find(g => g.goal_type === 'carbs');
  const fatGoal = macroGoals.find(g => g.goal_type === 'fat');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const goals: CreateGoalData[] = [];
    
    if (formData.calories) {
      goals.push({
        goal_type: 'calories',
        title: `Daily Calories: ${formData.calories} kcal`,
        target_value: parseFloat(formData.calories),
        target_unit: 'kcal',
        category: 'nutrition'
      });
    }
    
    if (formData.protein) {
      goals.push({
        goal_type: 'protein',
        title: `Daily Protein: ${formData.protein}g`,
        target_value: parseFloat(formData.protein),
        target_unit: 'g',
        category: 'nutrition'
      });
    }
    
    if (formData.carbs) {
      goals.push({
        goal_type: 'carbs',
        title: `Daily Carbs: ${formData.carbs}g`,
        target_value: parseFloat(formData.carbs),
        target_unit: 'g',
        category: 'nutrition'
      });
    }
    
    if (formData.fat) {
      goals.push({
        goal_type: 'fat',
        title: `Daily Fat: ${formData.fat}g`,
        target_value: parseFloat(formData.fat),
        target_unit: 'g',
        category: 'nutrition'
      });
    }

    // Create all macro goals
    for (const goal of goals) {
      const existingGoal = macroGoals.find(g => g.goal_type === goal.goal_type);
      if (existingGoal) {
        updateGoal({
          id: existingGoal.id,
          ...goal
        });
      } else {
        createGoal(goal);
      }
    }
    
    setIsEditing(false);
    setFormData({ calories: '', protein: '', carbs: '', fat: '' });
  };

  const handleEdit = () => {
    setFormData({
      calories: caloriesGoal?.target_value?.toString() || '',
      protein: proteinGoal?.target_value?.toString() || '',
      carbs: carbsGoal?.target_value?.toString() || '',
      fat: fatGoal?.target_value?.toString() || ''
    });
    setIsEditing(true);
  };

  const MacroProgressRing = ({ goal, color, size = 60 }: { goal: any, color: string, size?: number }) => {
    const progress = goal ? Math.min((goal.current_value / goal.target_value) * 100, 100) : 0;
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">
            {progress.toFixed(0)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Apple className="w-5 h-5 text-green-600" />
            Daily Macro Goals
          </div>
          {macroGoals.length > 0 && !isEditing && (
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {macroGoals.length === 0 && !isEditing ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">Set daily macro targets to optimize nutrition</p>
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Set Macro Goals
            </Button>
          </div>
        ) : isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="calories">Calories (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="2000"
                />
              </div>
              
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  placeholder="100"
                />
              </div>
              
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                  placeholder="250"
                />
              </div>
              
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={formData.fat}
                  onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                  placeholder="65"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? 'Saving...' : 'Save Goals'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {caloriesGoal && (
                <div className="text-center">
                  <MacroProgressRing goal={caloriesGoal} color="#f59e0b" />
                  <p className="text-sm font-medium mt-2">Calories</p>
                  <p className="text-xs text-gray-600">
                    {caloriesGoal.current_value || 0} / {caloriesGoal.target_value} kcal
                  </p>
                </div>
              )}
              
              {proteinGoal && (
                <div className="text-center">
                  <MacroProgressRing goal={proteinGoal} color="#ef4444" />
                  <p className="text-sm font-medium mt-2">Protein</p>
                  <p className="text-xs text-gray-600">
                    {proteinGoal.current_value || 0} / {proteinGoal.target_value}g
                  </p>
                </div>
              )}
              
              {carbsGoal && (
                <div className="text-center">
                  <MacroProgressRing goal={carbsGoal} color="#3b82f6" />
                  <p className="text-sm font-medium mt-2">Carbs</p>
                  <p className="text-xs text-gray-600">
                    {carbsGoal.current_value || 0} / {carbsGoal.target_value}g
                  </p>
                </div>
              )}
              
              {fatGoal && (
                <div className="text-center">
                  <MacroProgressRing goal={fatGoal} color="#10b981" />
                  <p className="text-sm font-medium mt-2">Fat</p>
                  <p className="text-xs text-gray-600">
                    {fatGoal.current_value || 0} / {fatGoal.target_value}g
                  </p>
                </div>
              )}
            </div>
            
            {macroGoals.length > 0 && (
              <div className="text-center">
                <Badge 
                  variant="secondary" 
                  className={`${
                    macroGoals.every(g => (g.current_value / g.target_value) >= 0.9) 
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                      : ''
                  }`}
                >
                  {macroGoals.every(g => (g.current_value / g.target_value) >= 0.9) 
                    ? '🏆 All Goals Met!' 
                    : 'Track your daily intake'}
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MacroGoalsCard;
