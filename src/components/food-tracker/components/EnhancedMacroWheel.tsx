
import { Card } from "@/components/ui/card";
import { PieChart } from "lucide-react";

const EnhancedMacroWheel = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Macro Distribution</h3>
      </div>
      <p className="text-gray-600">Macro breakdown chart coming soon!</p>
    </Card>
  );
};

export default EnhancedMacroWheel;
