
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface InstructionsCardProps {
  instructions: string[];
}

const InstructionsCard = ({ instructions }: InstructionsCardProps) => {
  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {instructions.map((instruction: string, index: number) => (
          <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
              {index + 1}
            </div>
            <p className="text-gray-700 leading-relaxed font-medium pt-1">{instruction}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default InstructionsCard;
