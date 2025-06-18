
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

const ChatHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Chat History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Chat history component</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatHistory;
