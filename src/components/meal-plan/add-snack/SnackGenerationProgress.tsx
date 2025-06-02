
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Search, Utensils, Save } from "lucide-react";

interface SnackGenerationProgressProps {
  step: string;
}

const STEP_CONFIG = {
  analyzing: {
    icon: Search,
    title: "Analyzing Your Preferences",
    description: "Processing your dietary requirements and remaining calories...",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  creating: {
    icon: Utensils,
    title: "Creating Perfect Snack",
    description: "Generating a nutritious snack that fits your meal plan...",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  saving: {
    icon: Save,
    title: "Saving to Meal Plan",
    description: "Adding your new snack to today's meal plan...",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  }
};

export const SnackGenerationProgress = ({ step }: SnackGenerationProgressProps) => {
  const config = STEP_CONFIG[step as keyof typeof STEP_CONFIG] || STEP_CONFIG.analyzing;
  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Icon className={`w-6 h-6 ${config.color}`} />
            <div className="absolute -inset-1">
              <div className={`w-8 h-8 rounded-full border-2 ${config.color} opacity-20 animate-ping`}></div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${config.color}`}>{config.title}</h3>
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>
          <Sparkles className={`w-5 h-5 ${config.color} animate-pulse`} />
        </div>
        
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full transition-all duration-1000 ${config.color.replace('text-', 'bg-')} animate-pulse`} 
               style={{ width: '60%' }}></div>
        </div>
      </CardContent>
    </Card>
  );
};
