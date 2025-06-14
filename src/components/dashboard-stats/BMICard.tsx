
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface BMICardProps {
  bmi: string | null;
  bmiCategory: string;
}

export const BMICard = ({ bmi, bmiCategory }: BMICardProps) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">BMI</p>
          <p className="text-2xl font-bold text-gray-800">
            {bmi || '—'}
          </p>
          <p className="text-sm text-gray-500">
            {bmiCategory}
          </p>
        </div>
        <div className="w-12 h-12 bg-fitness-gradient rounded-full flex items-center justify-center">
          <Activity className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};
