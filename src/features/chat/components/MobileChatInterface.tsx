
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

const MobileChatInterface = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Mobile Chat Interface
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Smartphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Mobile chat interface component</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileChatInterface;
