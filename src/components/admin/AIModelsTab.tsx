
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const AIModelsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Models
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">AI model management coming soon!</p>
      </CardContent>
    </Card>
  );
};

export default AIModelsTab;
