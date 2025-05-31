
import { Card, CardContent } from "@/components/ui/card";

interface InstructionsCardProps {
  instructions: string[];
}

const InstructionsCard = ({ instructions }: InstructionsCardProps) => {
  return (
    <Card className="bg-white border-fitness-primary-200 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-fitness-primary-700">
          <span className="text-2xl mr-3">👨‍🍳</span>
          Instructions
        </h3>
        <div className="space-y-4">
          {instructions.map((instruction: string, index: number) => (
            <div key={index} className="flex space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-fitness-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <p className="text-fitness-primary-600 pt-1 leading-relaxed">{instruction}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructionsCard;
