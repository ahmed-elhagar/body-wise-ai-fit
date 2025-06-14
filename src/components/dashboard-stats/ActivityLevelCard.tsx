
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface ActivityLevelCardProps {
  activityLevel?: string;
}

export const ActivityLevelCard = ({ activityLevel }: ActivityLevelCardProps) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Activity Level</p>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {activityLevel 
              ? activityLevel.replace('_', ' ').split(' ').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')
              : 'Not set'
            }
          </p>
        </div>
        <div className="w-12 h-12 bg-fitness-gradient rounded-full flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};
