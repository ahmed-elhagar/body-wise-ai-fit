
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Dumbbell, 
  Apple, 
  Target, 
  Calendar,
  Heart,
  Scale
} from "lucide-react";

interface ConversationStartersProps {
  onStarterClick: (message: string) => void;
  className?: string;
}

const ConversationStarters = ({ onStarterClick, className }: ConversationStartersProps) => {
  const starters = [
    {
      icon: <Dumbbell className="h-4 w-4" />,
      title: "Workout Plan",
      message: "I need a beginner-friendly workout plan for losing weight at home with no equipment.",
      category: "Exercise"
    },
    {
      icon: <Apple className="h-4 w-4" />,
      title: "Nutrition Help",
      message: "What are some healthy meal ideas for someone trying to build muscle?",
      category: "Nutrition"
    },
    {
      icon: <Target className="h-4 w-4" />,
      title: "Goal Setting",
      message: "How do I set realistic fitness goals and track my progress effectively?",
      category: "Goals"
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      title: "Schedule Help",
      message: "I only have 20 minutes a day to exercise. What's the best routine for me?",
      category: "Planning"
    },
    {
      icon: <Heart className="h-4 w-4" />,
      title: "Heart Health",
      message: "What exercises are best for improving cardiovascular health?",
      category: "Health"
    },
    {
      icon: <Scale className="h-4 w-4" />,
      title: "Weight Loss",
      message: "What's a safe and sustainable approach to losing 20 pounds?",
      category: "Weight Loss"
    }
  ];

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Get Started with Common Questions
        </h3>
        <p className="text-sm text-gray-600">
          Click any topic below to start a conversation with your AI fitness assistant
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {starters.map((starter, index) => (
          <Card 
            key={index}
            className="p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer group border border-gray-200 hover:border-blue-300"
            onClick={() => onStarterClick(starter.message)}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors flex-shrink-0">
                {starter.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                    {starter.title}
                  </h4>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {starter.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                  {starter.message}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConversationStarters;
