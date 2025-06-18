
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const AIModelsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Models Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">AI models management component</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIModelsTab;
