
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const AIChatInterface = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          AI Chat Interface
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">AI chat interface component</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatInterface;
