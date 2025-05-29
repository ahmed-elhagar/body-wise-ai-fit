
import { Card } from "@/components/ui/card";

interface InstructionsCardProps {
  instructions: string[];
}

const InstructionsCard = ({ instructions }: InstructionsCardProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <span className="text-2xl mr-2">👨‍🍳</span>
        Instructions
      </h3>
      <div className="space-y-4">
        {instructions.map((instruction: string, index: number) => (
          <div key={index} className="flex space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-fitness-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
            <p className="text-gray-700 pt-1">{instruction}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default InstructionsCard;
